import * as AWS from "aws-sdk";
import * as csv from "csv-parser";

const BUCKET_REGION = "eu-west-1";

export const importFileParser = async (event, _context) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
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

      await new Promise((resolve, reject) => {
        s3.getObject(params)
          .createReadStream()
          .pipe(csv())
          .on("data", (data) => console.log(data))
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
      return {
        statusCode: 500,
      };
    }

    return {
      statusCode: 202,
    };
  }
};
