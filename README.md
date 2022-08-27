# WordPress on AWS

The idea is to have a pattern that can be deployed which would result in a highly available, scalable, yet efficient WordPress solution.

It follows, roughly, the AWS WordPress architecture with some minor tweaks. Namely the adition of using S3 for static files and media that will be served up via CloudFront.

Another small change is that instead of being two (2) availability zones (AZs) and having two instances (one in each) being load balanced between. It can span N number of AZs but only have one running instance by default.

The autoscaling group however will ensure that atleast one is running at all times in any AZ that is available, but can spin up more instances as needed.

- [AWS Reference (CloudFormation)](https://github.com/aws-samples/aws-refarch-wordpress/)

## Conciderations

Currently this is planned to use EC2 instances, but a case could be made for Fargate Containers.

AWS CLI could be used a well to determine a few things. 1. How many AZs are in the target region? 2. What AZs have a given resource type available (not all AZs will have all of the same instqnce type availibility and/or capacity). Using the AWS-CLI we should be able deploy to N number of AZs where our requires instance type is available

## Architecture Diagram

![Proposed architecture diagram as of 8/26/2022](/docs/images/wordpress-on-aws-architecture.drawio.png)

### Services Used

[Amazon Virtual Private Cloud (Amazon VPC)](http://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Introduction.html), [Amazon Elastic Compute Cloud (Amazon EC2)](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html), [Auto Scaling](http://docs.aws.amazon.com/autoscaling/latest/userguide/WhatIsAutoScaling.html), [Elastic Load Balancing (Application Load Balancer)](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html), [Amazon Relational Database Service (Amazon RDS)](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html), [Amazon ElastiCache](http://docs.aws.amazon.com/AmazonElastiCache/latest/UserGuide/WhatIs.html), [Amazon Elastic File System (Amazon EFS)](http://docs.aws.amazon.com/efs/latest/ug/whatisefs.html), [Amazon CloudFront](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html), [Amazon Route 53](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html), [Amazon Certificate Manager (Amazon ACM)](http://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html) with [AWS CloudFormation](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) via [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html).

### Suggested WordPress plugins

1. [AWS for Wordpress](https://wordpress.org/plugins/amazon-polly/) (hasn't been updated in a while but is directly from AWS)
2. [W3 Total Cache](https://wordpress.org/plugins/w3-total-cache/)
3. [WP Offload Media](https://wordpress.org/plugins/amazon-s3-and-cloudfront/) (optional)

## CDK Stuff

This is a project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
