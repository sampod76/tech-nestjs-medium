import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { FilesService } from './files.service';
import { CreateUploadUrlDto } from './dto/create-upload-url.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';
import { FileQueryDto } from './dto/file-query.dto';

type AuthRequest = Request & {
  user?: {
    userId?: string;
    id?: string;
  };
};

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload-url')
  createUploadUrl(@Body() dto: CreateUploadUrlDto, @Req() req: AuthRequest) {
    const userId = req.user?.userId ?? req.user?.id;
    return this.filesService.createUploadUrl(dto, userId);
  }

  @Post('confirm-upload')
  confirmUpload(@Body() dto: ConfirmUploadDto, @Req() req: AuthRequest) {
    const userId = req.user?.userId ?? req.user?.id;
    return this.filesService.confirmUpload(dto, userId);
  }

  @Get('private/:fileKey')
  getPrivateFileUrl(@Param('fileKey') fileKey: string) {
    return this.filesService.getPrivateFileUrl(fileKey);
  }

  @Get()
  listFiles(@Query() query: FileQueryDto) {
    return this.filesService.listFiles(query);
  }

  @Delete(':id')
  deleteFile(@Param('id') id: string) {
    return this.filesService.deleteFile(id);
  }
}
