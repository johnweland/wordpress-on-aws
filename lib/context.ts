import { Construct } from 'constructs';

export class Context {
  constructor(
    private scope: Construct, private stage: string) { }

  /**
   * Project Name
   *
   * @returns string: Project Name
   */
  public getProjectName(): string {
    return this.scope.node.tryGetContext('project')
  }

  /**
   * Resource Name
   *
   * @returns string: Resource Name: Stage + Project Name
   */
  public getResouceName(): string {
    return this.stage + '-' + this.getProjectName()
  }

  /**
   * VPC cidr
   *
   * @returns string: CIDR
   */
  public getVpcCidr(): string {
    return this.scope.node.tryGetContext(this.stage)['vpc']['vpccidr']
  }

  /**
   * VPC AZ Count
   *
   * @returns number: AZ 数
   */
  public getVpcMaxAz(): number {
    return this.scope.node.tryGetContext(this.stage)['vpc']['maxazs']
  }

  /**
   * VPC Subnet CIDR
   *
   * @returns number: サブネットマスク
   */
  public getVpcSubnetCidrMask(): number {
    return this.scope.node.tryGetContext(this.stage)['vpc']['subnetcidrmask']
  }

  /**
   * VPC Subnet Name
   *
   * @returns string
   */
  public getVpcPublicSubnetName(): string {
    return 'Public'
  }

  /**
   * VPC Subnet Name
   *
   * @returns string
   */
  public getVpcPrivateSubnetName(): string {
    return 'Private'
  }

  /**
   * VPC Subnet Name
   *
   * @returns string
   */
  public getVpcIsolatedSubnetName(): string {
    return 'Isolated'
  }


  /**
   * EC2 key Name
   *
   * @returns string: ssh key name
   */
  public getEc2KeyName(): string {
    return this.scope.node.tryGetContext(this.stage)['ec2']['keyname']
  }

  /**
   * SG Source IP
   *
   * @returns string: Source IP
   */
  public getSgMyip(): string {
    return this.scope.node.tryGetContext(this.stage)['sg']['myip']
  }

  /**
   * ALB SG Name
   *
   * @returns string: ALB SG Name
   */
  public getAlbSgName(): string {
    return this.getResouceName() + '-alb'
  }

  /**
   * ECS SG Name
   *
   * @returns string: ECS SG Name
   */
  public getEcsSgName(): string {
    return this.getResouceName() + '-ecs'
  }

  /**
   * EC2 SG Name
   *
   * @returns string: EC2 SG Name
   */
  public getEc2SgName(): string {
    return this.getResouceName() + '-ec2'
  }

  /**
   * RDS SG Name
   *
   * @returns string: RDS SG Name
   */
  public getRdsSgName(): string {
    return this.getResouceName() + '-rds'
  }

  /**
   * S3 Bucket
   *
   * @returns string:  S3 Bucket
   */
  public getS3BucketName(): string {
    return this.getProjectName() + '-jweland'
  }

  /**
   * ECS Fargate CPU Size
   *
   * @returns number: Fargate CPU Size 
   */
  public getEcsFargateCpu(): number {
    return this.scope.node.tryGetContext(this.stage)['ecs']['cpu']
  }

  /**
   * ECS Fargate Memory Size
   *
   * @returns number: Fargate Memory Size 
   */
  public getEcsFargateMemory(): number {
    return this.scope.node.tryGetContext(this.stage)['ecs']['memory']
  }

  /**
   * ECS Task Desired Capacity
   *
   * @returns number: Task Desired Capacity
   */
  public getEcsDesiredCount(): number {
    return this.scope.node.tryGetContext(this.stage)['ecs']['desiredcount']
  }

  /**
   * ECS Task Image Name
   *
   * @returns string: image name
   */
  public getEcsImage(): string {
    return this.scope.node.tryGetContext(this.stage)['ecs']['image']
  }

  /**
   * ECS Task Container Name
   *
   * @returns string: Container Name 
   */
  public getEcsContainerName(): string {
    return this.scope.node.tryGetContext(this.stage)['ecs']['conteinername']
  }

  /**
   * ALB Certificate ARN
   *
   * @returns string: Certificate ARN
   */
  public getAlbCertificateArn(): string {
    return this.scope.node.tryGetContext(this.stage)['alb']['certificatearn']
  }

  /**
   * ALB Idle Timeout
   *
   * @returns number: Idle Timeout
   */
  public getAlbIdleTimeout(): number {
    return this.scope.node.tryGetContext(this.stage)['alb']['idletimeout']
  }

  /**
   * RDS Admin User Name
   *
   * @returns string: Admin User Name 
   */
  public getRdsCredencial(): string {
    return this.scope.node.tryGetContext(this.stage)['rds']['credentials']
  }

  /**
   * RDS Default DB Name 
   *
   * @returns string: DB Name 
   */
  public getRdsDefaultDBName(): string {
    return this.scope.node.tryGetContext(this.stage)['rds']['defaultdatabasename']
  }
}