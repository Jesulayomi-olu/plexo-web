import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'

const ddb = new DynamoDB({ region: process.env.AWS_REGION ?? 'us-east-1' })

export const docClient = DynamoDBDocument.from(ddb, {
  marshallOptions: { removeUndefinedValues: true },
})

export const CONTENT_TABLE = process.env.PLEXO_CONTENT_TABLE ?? ''
