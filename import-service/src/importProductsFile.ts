import { APIGatewayProxyHandler } from "aws-lambda";
import { S3 } from "aws-sdk";

export const importProductsFile: APIGatewayProxyHandler = async (
  event,
  _context
) => {
  const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  };
  const { name } = event.queryStringParameters;

  console.log(credentials, name);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message:
          "Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};
