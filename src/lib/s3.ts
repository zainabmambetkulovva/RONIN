import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.AWS_ENDPOINT, // for local MinIO
});

const BUCKET = process.env.AWS_BUCKET_NAME || "ronin";

export async function uploadFile(
  key: string,
  file: Buffer,
  contentType: string
): Promise<string> {
  const params: AWS.S3.PutObjectRequest = {
    Bucket: BUCKET,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: "public-read",
  };

  await s3.upload(params).promise();

  return `${process.env.AWS_CDN_URL || `https://${BUCKET}.s3.amazonaws.com`}/${key}`;
}

export async function deleteFile(key: string): Promise<void> {
  await s3
    .deleteObject({
      Bucket: BUCKET,
      Key: key,
    })
    .promise();
}

export function getFileKey(folder: string, filename: string): string {
  const ext = filename.split(".").pop();
  const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  return `${folder}/${uniqueName}`;
}
