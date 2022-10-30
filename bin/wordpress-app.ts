#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { WordpressAppStack } from '../lib/wordpress-app-stack';

import { Context } from '../lib/context'
import { Tags } from 'aws-cdk-lib';

const app = new cdk.App();

const stage = app.node.tryGetContext('stage')


const stageTypes: Array<string> = ['dev', 'uat', 'prod']
if (undefined == stage || !stageTypes.includes(stage)) {
  console.error('ERROR: Stage not set. Please specify the stage in the parameters. \nex: cdk deploy -c stage=dev')
  process.exit(9)
};
const context = new Context(app, stage);

new WordpressAppStack(app, context.getResouceName() + '-stack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
});

Tags.of(app).add("environment", stage);
Tags.of(app).add("project", app.node.tryGetContext('project'));