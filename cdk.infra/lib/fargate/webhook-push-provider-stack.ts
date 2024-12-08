import * as cdk from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import { CommonStack } from '../common/common-stack';

export class WebhookPushProviderStack extends CommonStack {

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {

        super(scope, id, props);


// Create VPC for the ECS cluster
const vpc = new ec2.Vpc(
    stack, 
    "MlWebhookSystemVpc", 
    {maxAzs: 2});

// Create ECS cluster
const cluster = new ecs.Cluster(
    stack,
    "MlWebhookSystemCluster",
    {vpc: vpc});

const inQueue = new sqs.Queue(
    stack,
    "MlWebhookSystemQueue",
    {
        queueName: "webhook-queue",
        visibilityTimeout: cdk.Duration.seconds(300)
    }
);

const fargateService = new ecs_patterns.QueueProcessingFargateService(
    stack,
    "MlWebhookSystemFargateService",
    {
        cluster: cluster,
        cpu: 2,
        memoryLimitMiB: 4096,
        queue: inQueue,
        image: ecs.ContainerImage.fromAsset(resolve(__dirname, "..")),
        environment: {
            QUEUE_NAME: "webhook-queue"
        }
    }
);

const scalingFargateService = fargateService.service.autoScaleTaskCount({
        minCapacity: 1,
        maxCapacity: 5,
    });

scalingFargateService.scaleOnCpuUtilization("scaleOnCpuUtilization", {
    targetUtilizationPercent: 60,
    scaleInCooldown: cdk.Duration.seconds(60),
    scaleOutCooldown: cdk.Duration.seconds(60),
})
    }
}