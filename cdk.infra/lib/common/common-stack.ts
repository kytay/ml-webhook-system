import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export class CommonStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create VPC for the ECS cluster
        const vpc = new ec2.Vpc(
            this, 
            "MlWebhookSystemVpc", 
            {maxAzs: 2});

        // Create ECS cluster
        const cluster = new ecs.Cluster(
            this,
            "MlWebhookSystemCluster",
            {vpc: vpc});

        const inQueue = new sqs.Queue(
            this,
            "MlWebhookSystemQueue",
            {
                queueName: "webhook-queue",
                visibilityTimeout: cdk.Duration.seconds(300)
            }
        );
    
    }   

    
}