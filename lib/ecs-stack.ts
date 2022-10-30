import { Stack, StackProps, aws_ec2, aws_ecs, aws_iam } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';


import { Context } from './context';

export class EcsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }

  /**
   * ECS
   *
   * @param context: Context
   * @param vpc: ec2.Vpc
   * @param ecsSg: ec2.SecurityGroup
   *
   * @returns interface: FargateServiceProps
   */
  public createEcs(
    context: Context,
    vpc: aws_ec2.Vpc,
    ecsSg: aws_ec2.SecurityGroup,
    fileSystemId: string
  ) {
    const cluster = new aws_ecs.Cluster(this, 'cluster', {
      vpc: vpc,
      clusterName: context.getResouceName()
    });

    const task = new aws_ecs.FargateTaskDefinition(this, 'task', {
      family: context.getResouceName(),
      cpu: context.getEcsFargateCpu(),
      memoryLimitMiB: context.getEcsFargateMemory(),
    });
    task.addVolume({
      name: context.getResouceName(),
      efsVolumeConfiguration: {
        fileSystemId: fileSystemId,
        rootDirectory: context.getResouceName()
      }
    });
    task.addToTaskRolePolicy(
      new aws_iam.PolicyStatement({
        actions: [
          'elasticfilesystem:ClientRootAccess',
          'elasticfilesystem:ClientWrite',
          'elasticfilesystem:ClientMount',
          'elasticfilesystem:DescribeMountTargets',
        ],
        resources: [`arn:aws:elasticfilesystem:${this.region}:${this.account}:file-system/${fileSystemId}`],
      })
    );

    // ECR 独自イメージを利用する場合はコメントアウト削除
    // task.addToTaskRolePolicy(
    //   new aws_iam.PolicyStatement({
    //     actions: [
    //       "ecr:GetAuthorizationToken",
    //       "ecr:BatchCheckLayerAvailability",
    //       "ecr:GetDownloadUrlForLayer",
    //       "ecr:BatchGetImage"
    //     ],
    //     resources: [`*`],
    //   })
    // );

    // CloudWatch 
    const logGroup = new logs.LogGroup(this, 'logGroup', {
      logGroupName: context.getResouceName()
    });

    const container = task.addContainer('container', {
      image: aws_ecs.ContainerImage.fromRegistry(context.getEcsImage()),
      containerName: 'main',
      logging: aws_ecs.LogDriver.awsLogs({
        logGroup: logGroup,
        streamPrefix: 'ecs'
      }),
    });
    container.addPortMappings({
      containerPort: 80,
      protocol: aws_ecs.Protocol.TCP,
    });
    container.addMountPoints({
      containerPath: '/var/www/html',
      sourceVolume: context.getResouceName(),
      readOnly: false
    });

    const service = new aws_ecs.FargateService(this, 'service', {
      cluster,
      serviceName: context.getResouceName(),
      taskDefinition: task,
      assignPublicIp: false,
      desiredCount: 1,
      enableExecuteCommand: true,
      healthCheckGracePeriod: cdk.Duration.seconds(300),
      securityGroups: [ecsSg],
      vpcSubnets: vpc.selectSubnets({ subnetType: aws_ec2.SubnetType.PRIVATE_WITH_NAT }),
    });
    return service;
  }
}