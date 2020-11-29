import * as AWS from "aws-sdk";
import * as csv from "csv-parser";
import { S3Handler } from "aws-lambda";

const {
  BUCKET_REGION,
  SECRET_KEY,
  ACCESS_KEY,
  CATALOG_QUEUE_URL,
} = process.env;

export const importFileParser: S3Handler = async (event, _context) => {
  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  });

  for (const record of event?.Records) {
    const {
      s3: { bucket, object },
    } = record;

    try {
      const params = {
        Bucket: bucket.name,
        Key: object.key,
      };
      const s3 = new AWS.S3({ region: BUCKET_REGION, signatureVersion: "v4" });
      const sqs = new AWS.SQS();

      await new Promise((resolve, reject) => {
        s3.getObject(params)
          .createReadStream()
          .pipe(csv())
          .on("data", async (data) => {
            console.log("DATA:", data);
            try {
              const params = {
                MessageBody: JSON.stringify(data),
                QueueUrl: CATALOG_QUEUE_URL,
              };
              await sqs.sendMessage(params).promise();
            } catch (err) {
              console.log("Error in try block:", err);
            }
          })
          .on("error", reject)
          .on("end", async () => {
            await s3
              .copyObject({
                Bucket: bucket.name,
                CopySource: `${bucket.name}/${object.key}`,
                Key: object.key.replace("uploaded", "parsed"),
              })
              .promise();

            await s3
              .deleteObject({
                Bucket: bucket.name,
                Key: object.key,
              })
              .promise();
            resolve();
          });
      });
    } catch (err) {
      console.log("Error occurred:", err);
    }
  }
};
