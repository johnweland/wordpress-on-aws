import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { VpcStack } from './vpc-stack'
import { SgStack } from './sg-stack'
import { EcsStack } from './ecs-stack'
import { Ec2Stack } from './ec2-stack';
import { AlbStack } from './alb-stack';
import { RdsStack } from './rds-stack';
import { Context } from './context';

export class WordpressAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const stage = scope.node.tryGetContext('stage')
    const context = new Context(scope, stage)
    const sg = new SgStack(scope, context.getResouceName() + '-sg', props)
    const vpc = new VpcStack(scope, context.getResouceName() + '-vpc', props).createVpc(context)
    const albSg = sg.createAlbSg(context, vpc)
    const ecsSg = sg.createEcsSg(context, vpc)
    const ec2Sg = sg.createEc2Sg(context, vpc, ecsSg)
    const rdsSg = sg.createRdsSg(context, vpc, ecsSg, ec2Sg)
    const fileSystemId = new Ec2Stack(scope, context.getResouceName() + '-ec2', props).createEC2(context, vpc, ec2Sg)
    const service = new EcsStack(scope, context.getResouceName() + '-ecs', props).createEcs(context, vpc, ecsSg, fileSystemId)
    new AlbStack(scope, context.getResouceName() + '-alb', props).createAlb(context, vpc, albSg, service, stage)
    new RdsStack(scope, context.getResouceName() + '-rds', props).createRds(context, vpc, rdsSg)
  }
}