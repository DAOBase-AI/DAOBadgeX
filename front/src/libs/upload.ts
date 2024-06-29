import { uuid } from '@/utils';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export const uploadImg = async (file: File): Promise<any> => {
  const { AWS_REGION, AWS_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } =
    process.env;

  const client = new S3Client({
    region: AWS_REGION,
    credentialDefaultProvider: (() =>
      Promise.resolve({
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      })) as any,
  });

  const fileName = uuid();

  const res = await client.send(
    new PutObjectCommand({
      ACL: 'public-read',
      Bucket: AWS_BUCKET,
      Body: file,
      Key: fileName,
      ContentType: 'image/png',
    }),
  );
  if (res.$metadata.httpStatusCode === 200) {
    const url = `https://${AWS_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${fileName}`;
    return url;
  }
};
