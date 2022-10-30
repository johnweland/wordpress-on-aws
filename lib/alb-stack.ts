import { Stack, StackProps, aws_ec2, aws_ecs, aws_s3 } from 'aws-cdk-lib';
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as cdk from "aws-cdk-lib";
import { Construct } from 'constructs';

import { Context } from './context';

export class AlbStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }

  /**
   * Application Load Blancer, Target Group
   *
   * @param context: Context
   * @param vpc:     aws_ec2.Vpc
   * @param albSg:   aws_ec2.SecurityGroup
   * @param service: aws_ecs.FargateService
   * @param stage:   string
   */
  public createAlb(
    context: Context,
    vpc: aws_ec2.Vpc,
    albSg: aws_ec2.SecurityGroup,
    service: aws_ecs.FargateService,
    stage: string
  ) {
    const alb = new elbv2.ApplicationLoadBalancer(this, 'applicationloadblancer', {
      vpc: vpc,
      vpcSubnets: { subnets: vpc.publicSubnets },
      internetFacing: true,
      idleTimeout: cdk.Duration.seconds(context.getAlbIdleTimeout()),
      loadBalancerName: context.getResouceName(),
      securityGroup: albSg
    });
    const targetGroup = new elbv2.ApplicationTargetGroup(this, 'targetgroup', {
      vpc: vpc,
      port: 80,
      targets: [service],
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      targetGroupName: context.getResouceName(),
      healthCheck: {
        healthyHttpCodes: '200',
        healthyThresholdCount: 2,
        interval: cdk.Duration.seconds(30),
        path: '/readme.html',
        timeout: cdk.Duration.seconds(5),
        unhealthyThresholdCount: 2,
      }
    });
    alb.addListener('http', {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultTargetGroups: [targetGroup]
    }).addAction('http', {
      priority: 1,
      conditions: [
        elbv2.ListenerCondition.pathPatterns(['/*']),
      ],
      action: elbv2.ListenerAction.redirect({
        port: '443',
        protocol: elbv2.ApplicationProtocol.HTTPS,
      })
    })
    // alb.addListener('https', {
    //   port: 443,
    //   protocol: elbv2.ApplicationProtocol.HTTPS,
    //   certificates: [
    //     elbv2.ListenerCertificate.fromArn(context.getAlbCertificateArn())
    //   ],
    //   defaultTargetGroups: [targetGroup]
    // })
    alb.logAccessLogs(
      new aws_s3.Bucket(this, 's3loggingbucket', {
        bucketName: context.getS3BucketName()
      }),
      stage
    );
  }
}