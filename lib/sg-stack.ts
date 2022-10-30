import { Stack, StackProps, aws_ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Context } from './context';

export class SgStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }

  /**
   * Create SecurityGroup for ALB
   *
   * @param context: Context
   * @param vpc:     aws_ec2.Vpc
   *
   * @returns interface: SecurityGroupProps
   */
  public createAlbSg(context: Context, vpc: aws_ec2.Vpc) {
    const albSecurityGroup = new aws_ec2.SecurityGroup(this, 'albsecuritygroup', {
      vpc: vpc,
      allowAllOutbound: true,
      securityGroupName: context.getAlbSgName(),
      description: 'SecurityGroup for ALB.'
    });
    albSecurityGroup.addIngressRule(
      aws_ec2.Peer.ipv4(context.getSgMyip()),
      aws_ec2.Port.tcp(80),
      'My source IP.'
    );
    albSecurityGroup.addIngressRule(
      aws_ec2.Peer.ipv4(context.getSgMyip()),
      aws_ec2.Port.tcp(443),
      'My source IP.'
    );
    return albSecurityGroup;
  }

  /**
   * Create SecurityGroup for ECS
   *
   * @param context: Context
   * @param vpc: aws_ec2.Vpc
   *
   * @returns interface: SecurityGroupProps
   */
  public createEcsSg(context: Context, vpc: aws_ec2.Vpc) {
    return new aws_ec2.SecurityGroup(this, 'ecssecuritygroup', {
      vpc: vpc,
      allowAllOutbound: true,
      securityGroupName: context.getEcsSgName(),
    });
  }

  /**
   * Create SecurityGroup for EC2
   *
   * @param context: Context
   * @param vpc: aws_ec2.Vpc
   * @param ecsSg: aws_ec2.SecurityGroup
   *
   * @returns interface: SecurityGroupProps
   */
  public createEc2Sg(context: Context, vpc: aws_ec2.Vpc, ecsSg: aws_ec2.SecurityGroup) {
    const ec2SecurityGroup = new aws_ec2.SecurityGroup(this, 'ec2securitygroup', {
      vpc: vpc,
      allowAllOutbound: true,
      securityGroupName: context.getEc2SgName(),
    });
    ec2SecurityGroup.addIngressRule(
      aws_ec2.Peer.ipv4(context.getSgMyip()),
      aws_ec2.Port.tcp(22),
      'My source IP.'
    );
    ec2SecurityGroup.addIngressRule(
      aws_ec2.Peer.securityGroupId(ecsSg.securityGroupId),
      aws_ec2.Port.tcp(2049),
      'Traffic from EFS.'
    );
    return ec2SecurityGroup;
  }

  /**
   * Create SecurityGroup for RDS
   *
   * @param context: Context
   * @param vpc: aws_ec2.Vpc
   * @param ecsSg: aws_ec2.SecurityGroup
   * @param ec2Sg: aws_ec2.SecurityGroup
   *
   * @returns SG IF オブジェクト
   */
  public createRdsSg(context: Context, vpc: aws_ec2.Vpc, ecsSg: aws_ec2.SecurityGroup, ec2Sg: aws_ec2.SecurityGroup) {
    const rdsSecurityGroup = new aws_ec2.SecurityGroup(this, 'rdssecuritygroup', {
      vpc: vpc,
      allowAllOutbound: true,
      securityGroupName: context.getRdsSgName(),
    });
    rdsSecurityGroup.addIngressRule(
      aws_ec2.Peer.securityGroupId(ecsSg.securityGroupId),
      aws_ec2.Port.tcp(3306),
      'Traffic from ECS.'
    );
    rdsSecurityGroup.addIngressRule(
      aws_ec2.Peer.securityGroupId(ec2Sg.securityGroupId),
      aws_ec2.Port.tcp(3306),
      'Traffic from EC2.'
    );
    return rdsSecurityGroup;
  }
}