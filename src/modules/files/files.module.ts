import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FilesRepository } from './files.repository';
import { AwsStorageService } from './storage/aws-storage.service';

import { FileQueueProducer } from './queue/file-queue.producer';
import { FileProcessorWorker } from './queue/file-processor.worker';
import { FILE_PROCESSING_QUEUE } from './queue/file-queue.constant';

@Module({
  imports: [
    BullModule.registerQueue({
      name: FILE_PROCESSING_QUEUE,
    }),
  ],
  controllers: [FilesController],
  providers: [
    FilesService,
    FilesRepository,
    AwsStorageService,
    FileQueueProducer,
    FileProcessorWorker,
  ],
  exports: [FilesService],
})
export class FilesModule {}
