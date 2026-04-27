import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { FILE_PROCESSING_QUEUE, FILE_QUEUE_JOBS } from './file-queue.constant';
import { AwsStorageService } from '../storage/aws-storage.service';

@Injectable()
@Processor(FILE_PROCESSING_QUEUE)
export class FileProcessorWorker extends WorkerHost {
  private readonly logger = new Logger(FileProcessorWorker.name);

  constructor(private readonly awsStorageService: AwsStorageService) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case FILE_QUEUE_JOBS.PROCESS_UPLOADED_FILE:
        await this.processUploadedFile(job);
        break;

      case FILE_QUEUE_JOBS.DELETE_S3_FILE:
        await this.deleteS3File(job);
        break;

      default:
        this.logger.warn(`Unknown job: ${job.name}`);
    }
  }

  private async processUploadedFile(job: Job) {
    const { fileId, path, mimetype, category } = job.data;

    this.logger.log(
      `Processing file: ${fileId}, path: ${path}, mimetype: ${mimetype}, category: ${category}`,
    );

    // Future:
    // - image resize
    // - thumbnail generate
    // - compression
    // - virus scan
    // ✅ dummy await (keep async valid)
    await Promise.resolve();
  }

  private async deleteS3File(job: Job) {
    const { fileId, path } = job.data as { fileId: string; path: string };

    await this.awsStorageService.deleteFile(path);

    this.logger.log(`Deleted S3 file: ${fileId}, path: ${path}`);
  }
}
