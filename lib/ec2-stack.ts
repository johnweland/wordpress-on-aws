import { Stack, StackProps, aws_ec2, aws_efs } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Context } from './context';

export class Ec2Stack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }

  /**
   * EC2, EFS
   *
   * @param context: Context
   * @param vpc: ec2.Vpc
   * @param ec2sg: ec2.SecurityGroup
   *
   * @returns interface: FileSystemProps
   */
  public createEC2(context: Context, vpc: aws_ec2.Vpc, ec2sg: aws_ec2.SecurityGroup) {
    const workEc2 = new aws_ec2.Instance(this, 'instance', {
      vpc,
      instanceType: aws_ec2.InstanceType.of(
        aws_ec2.InstanceClass.T3A,
        aws_ec2.InstanceSize.MICRO
      ),
      machineImage: new aws_ec2.AmazonLinuxImage({
        generation: aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        cpuType: aws_ec2.AmazonLinuxCpuType.X86_64,
      }),
      instanceName: context.getResouceName(),
      keyName: context.getEc2KeyName(),
      securityGroup: ec2sg,
      vpcSubnets: {
        subnetType: aws_ec2.SubnetType.PUBLIC
      }
    });

    const elasticFileSystem = new aws_efs.FileSystem(this, 'efs', {
      vpc,
      fileSystemName: context.getResouceName(),
      securityGroup: ec2sg
    });

    elasticFileSystem.connections.allowDefaultPortFrom(workEc2)
    workEc2.userData.addCommands(
      'sudo yum check-update -y',
      'sudo yum upgrade -y',
      'sudo yum install -y amazon-efs-utils',
      'sudo mkdir /efs',
      'sudo mount -t efs ' + elasticFileSystem.fileSystemId + ':/ /efs',
      'sudo mkdir /efs/' + context.getResouceName()
    );
    return elasticFileSystem.fileSystemId;
  }
}