import { Stack, StackProps, aws_ec2 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Context } from './context';

export class VpcStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }

  /**
   * VPC
   *
   * @param context: Context
   *
   * @returns interface VpcProps
   */
  public createVpc(context: Context) {
    return new aws_ec2.Vpc(this, 'vpc', {
      cidr: context.getVpcCidr(),
      flowLogs: {
        'vpcflowlog': {}
      },
      enableDnsHostnames: true,
      enableDnsSupport: true,
      natGateways: 1,
      maxAzs: context.getVpcMaxAz(),
      vpcName: context.getResouceName(),
      subnetConfiguration: [
        {
          name: context.getVpcPublicSubnetName(),
          cidrMask: context.getVpcSubnetCidrMask(),
          subnetType: aws_ec2.SubnetType.PUBLIC,
        },
        {
          name: context.getVpcPrivateSubnetName(),
          cidrMask: context.getVpcSubnetCidrMask(),
          subnetType: aws_ec2.SubnetType.PRIVATE_WITH_NAT,
        },
        {
          name: context.getVpcIsolatedSubnetName(),
          cidrMask: context.getVpcSubnetCidrMask(),
          subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
  }
}