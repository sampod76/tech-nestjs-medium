import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { FILE_PROCESSING_QUEUE, FILE_QUEUE_JOBS } from './file-queue.constant';

@Injectable()
export class FileQueueProducer {
  constructor(
    @InjectQueue(FILE_PROCESSING_QUEUE)
    private readonly fileQueue: Queue,
  ) {}

  async addProcessUploadedFileJob(payload: {
    fileId: string;
    path: string;
    mimetype: string;
  }) {
    await this.fileQueue.add(FILE_QUEUE_JOBS.PROCESS_UPLOADED_FILE, payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async addDeleteS3FileJob(payload: { path: string }) {
    await this.fileQueue.add(FILE_QUEUE_JOBS.DELETE_S3_FILE, payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }
}
