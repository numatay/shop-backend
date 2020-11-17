import type { Serverless } from "serverless/aws";

const serverlessConfiguration: Serverless = {
  service: {
    name: "import-service",
  },
  frameworkVersion: "2",
  custom: {
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: true,
    },
  },
  // Add the serverless-webpack plugin
  plugins: ["serverless-webpack", "serverless-dotenv-plugin"],
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    region: "eu-west-1",
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
      AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
      BUCKET_NAME: process.env.BUCKET_NAME,
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:ListBucket",
        Resource: "arn:aws:s3:::numatay-aws-task05-bucket",
      },
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource: "arn:aws:s3:::numatay-aws-task05-bucket/*",
      },
    ],
  },
  functions: {
    importProductsFile: {
      handler: "handler.importProductsFile",
      events: [
        {
          http: {
            method: "get",
            path: "import",
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true,
                },
              },
            },
          },
        },
      ],
    },
    importFileParser: {
      handler: "handler.importFileParser",
      events: [
        {
          s3: {
            bucket: "numatay-aws-task05-bucket",
            event: "s3:ObjectCreated:*",
            rules: [
              {
                prefix: "uploaded/",
                suffix: "",
              },
            ],
            existing: true,
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
