import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SIGNED_PRIVATE_URL_EXPIRES_IN,
  SIGNED_UPLOAD_URL_EXPIRES_IN,
} from '../constants/file.constant';

@Injectable()
export class AwsS3Util {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly cloudfrontUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.getOrThrow<string>('AWS_S3_BUCKET');
    this.cloudfrontUrl =
      this.configService.getOrThrow<string>('AWS_CLOUDFRONT_URL');

    this.s3 = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  getCdnUrl(path: string): string {
    return `${this.cloudfrontUrl.replace(/\/$/, '')}/${path}`;
  }

  async generateUploadUrl(params: {
    path: string;
    mimetype: string;
    isPublic: boolean;
  }): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: params.path,
      ContentType: params.mimetype,
      CacheControl: params.isPublic
        ? 'public, max-age=31536000, immutable'
        : 'private, no-store',
    });

    return getSignedUrl(this.s3, command, {
      expiresIn: SIGNED_UPLOAD_URL_EXPIRES_IN,
    });
  }

  async generatePrivateDownloadUrl(path: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: path,
    });

    return getSignedUrl(this.s3, command, {
      expiresIn: SIGNED_PRIVATE_URL_EXPIRES_IN,
    });
  }

  async verifyFileExists(path: string): Promise<boolean> {
    try {
      await this.s3.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: path,
        }),
      );

      return true;
    } catch {
      return false;
    }
  }

  async deleteFile(path: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: path,
      }),
    );
  }

  async listFilesFromS3(params: {
    prefix?: string;
    limit?: number;
    continuationToken?: string;
  }) {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: params.prefix,
      MaxKeys: params.limit ?? 20,
      ContinuationToken: params.continuationToken,
    });

    return this.s3.send(command);
  }
}

/* 
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;
const CDN = process.env.AWS_CLOUDFRONT_URL!;

export async function generateUploadUrl(
  key: string,
  mimetype: string,
) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: mimetype,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  return {
    uploadUrl: signedUrl,
    path: key,
    url: `${CDN}/${key}`,
  };
}

export async function generateDownloadUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });

  return getSignedUrl(s3, command, { expiresIn: 60 });
}

export async function verifyFileExists(key: string) {
  try {
    await s3.send(
      new HeadObjectCommand({
        Bucket: BUCKET,
        Key: key,
      }),
    );
    return true;
  } catch {
    return false;
  }
}

export async function deleteFileFromS3(key: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
  );
}

export async function listS3Files(prefix: string, token?: string) {
  return s3.send(
    new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      ContinuationToken: token,
      MaxKeys: 20,
    }),
  );
}

*/
