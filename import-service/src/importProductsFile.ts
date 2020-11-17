import { APIGatewayProxyHandler } from "aws-lambda";
import * as AWS from "aws-sdk";
import { addCorsHeaders } from "../../product-service/src/utils";

const { BUCKET_REGION, BUCKET_NAME, ACCESS_KEY, SECRET_KEY } = process.env;

export const importProductsFile: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const { name } = event.queryStringParameters;
  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  });
  const s3 = new AWS.S3({ region: BUCKET_REGION, signatureVersion: "v4" });

  const signedUrl = await s3.getSignedUrlPromise("putObject", {
    Bucket: BUCKET_NAME,
    Key: `uploaded/${name}`,
    ContentType: "text/csv",
    Expires: 100,
  });

  return {
    statusCode: 200,
    headers: addCorsHeaders(),
    body: signedUrl,
  };
};
