import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";

const BUCKET_REGION = "eu-west-1";

export const importProductsFile: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const { name } = event.queryStringParameters;
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });
  const s3 = new AWS.S3({ region: BUCKET_REGION, signatureVersion: "v4" });

  const signedUrl = await s3.getSignedUrlPromise("putObject", {
    Bucket: "numatay-aws-task05-bucket",
    Key: `uploaded/${name}`,
    ContentType: "text/csv",
    Expires: 100,
  });

  return {
    statusCode: 200,
    body: signedUrl,
  };
};
