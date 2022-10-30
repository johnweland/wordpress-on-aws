import { Stack, StackProps, aws_ec2, aws_rds } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { Context } from './context';

export class RdsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }

  /**
   * Create RDS
   *
   * @param context: Context
   * @param vpc: ec2.Vpc
   * @param rdsSg: ec2.SecurityGroup
   */
  public createRds(context: Context, vpc: aws_ec2.Vpc, rdsSg: aws_ec2.SecurityGroup) {
    const subnetGroup = new aws_rds.SubnetGroup(this, 'subnetgroup', {
      vpc,
      vpcSubnets: { subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED },
      subnetGroupName: context.getResouceName() + '-isolated',
      description: 'SubnetGroup for Aurora db',
    })

    const clusterParameterGroup = new aws_rds.ParameterGroup(this, 'cluster', {
      engine: aws_rds.DatabaseClusterEngine.auroraMysql({
        version: aws_rds.AuroraMysqlEngineVersion.VER_3_01_0
      }),
      parameters: {
        time_zone: 'US/Central',
        character_set_client: 'utf8mb4',
        character_set_connection: 'utf8mb4',
        character_set_database: 'utf8mb4',
        character_set_results: 'utf8mb4',
        character_set_server: 'utf8mb4',
        collation_connection: 'utf8mb4_bin',
      }
    })
    const instanceParameterGroup = new aws_rds.ParameterGroup(this, 'instance', {
      engine: aws_rds.DatabaseClusterEngine.auroraMysql({
        version: aws_rds.AuroraMysqlEngineVersion.VER_3_01_0
      })
    })

    new aws_rds.DatabaseCluster(this, 'rds', {
      engine: aws_rds.DatabaseClusterEngine.auroraMysql({
        version: aws_rds.AuroraMysqlEngineVersion.VER_3_01_0
      }),
      instanceProps: {
        vpc,
        autoMinorVersionUpgrade: false,
        instanceType: aws_ec2.InstanceType.of(
          aws_ec2.InstanceClass.BURSTABLE3,
          aws_ec2.InstanceSize.MEDIUM,
        ),
        parameterGroup: instanceParameterGroup,
        securityGroups: [rdsSg],
      },
      clusterIdentifier: context.getResouceName(),
      credentials: aws_rds.Credentials.fromGeneratedSecret(context.getRdsCredencial()),
      defaultDatabaseName: context.getRdsDefaultDBName(),
      deletionProtection: false,
      instances: 1,
      parameterGroup: clusterParameterGroup,
      subnetGroup: subnetGroup
    });
  }
}