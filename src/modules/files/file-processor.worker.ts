import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { AwsS3Util } from '../../common/utils/aws-s3.util';

@Processor('file-processing')
export class FileProcessorWorker extends WorkerHost {
  private readonly logger = new Logger(FileProcessorWorker.name);

  constructor(private readonly awsS3Util: AwsS3Util) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case 'process-media': {
        // Thumbnail generation / compression logic goes here
        // Example:
        // 1. Download file from S3 to temp dir
        // 2. Compress/resize using sharp or ffmpeg
        // 3. Upload thumbnails back to S3
        // 4. Update file metadata in DB
        this.logger.debug(`Simulating media processing for fileId: ${job.data.fileId}`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        this.logger.log(`Successfully processed media for fileId: ${job.data.fileId}`);
        break;
      }
      case 'delete-s3-file': {
        // Asynchronously delete file from S3 (since we soft deleted in DB)
        this.logger.debug(`Deleting S3 file at path: ${job.data.path}`);
        await this.awsS3Util.deleteFile(job.data.path);
        this.logger.log(`Successfully deleted S3 file at path: ${job.data.path}`);
        break;
      }
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }
}
