import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as quicksight from 'aws-cdk-lib/aws-quicksight';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class QuicksightVisualizerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //create an S3 Buckect to store QuickSight  Dataset
    const qsBucket = new s3.Bucket(this, 'qsBucket', {
      bucketName: 'qsbucket-test-1',
      removalPolicy: cdk.RemovalPolicy.DESTROY, 
    })

    //Defining an AWS QuickSight data source for the Dataset
    const dataSource = new quicksight.CfnDataSource(this, 'dataSource', {
      name: 'dataSource',
      dataSourceParameters:{
         s3Parameters:{
            manifestFileLocation:{
            bucket: qsBucket.bucketName,
            key: 's3://BUCKET-NAME/manifest.json', //update actual path to manifest file
          },
         },
      },
      type: 'S3', // Data source type
    });

    //Defining IAM Policy to allow QuickSight to access S3 bucket 
    const quicksightPolicy = new iam.Policy(this, 'QuickSightPolicy', {
      statements: [
        new iam.PolicyStatement({
          actions:['quicksight:DescribeDataSource'],
          resources: [dataSource.attrArn],
        }),
      ],
    });

    const quickSightRole = new iam.Role(this, 'QuickSightRole', {
      assumedBy: new iam.ServicePrincipal('quicksight.amazonaws.com'),
    });

    quicksightPolicy.attachToRole(quickSightRole);

    const dataset = new quicksight.CfnDataSet(this, 'DataSet', {
      name: 'DataSet',
      awsAccountId: cdk.Aws.ACCOUNT_ID,
      physicalTableMap: {
        physicalTableMapKey: {          
          s3Source: {
            dataSourceArn: 'bucket-arn',
            // the properties below are optional
            uploadSettings: {
              format: 'csv',
              startFromRow: 1,
            },
            inputColumns: [
              {
                name: 'product_id',
                type: 'enum',
              },
              {
                name: 'title',
                type: 'string',
              },
              {
                name: 'availability',
                type: 'string',
              },
              {
                name: 'brand',
                type: 'string',
              },
              {
                name: 'categories',
                type: 'string',
              },
              {
                name: 'price',
                type: 'decimal',
              },
              {
                name: 'seller_id',
                type: 'string',
              },
              {
                name: 'seller_name',
                type: 'string',
              },
              {
                name: 'url',
                type: 'string',
              }, 
          ],
          },          
        }
      }
    });     
  }
}
