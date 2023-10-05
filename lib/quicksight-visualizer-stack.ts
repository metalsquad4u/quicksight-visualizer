import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class QuicksightVisualizerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //create an S3 Buckect to store QuickSight  Dataset
    const qsBucket = new s3.Bucket(this, 'qsBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY, 
    })
  }
}
