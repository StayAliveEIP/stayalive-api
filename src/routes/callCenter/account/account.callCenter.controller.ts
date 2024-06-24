import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { AccountCallCenterService } from './account.callCenter.service';
import { SuccessMessage } from '../../../dto.dto';
import {
  AccountInformationResponse,
  UpdateAddressRequest,
  UpdateNameRequest,
} from './account.callCenter.dto';
import { Types } from 'mongoose';
import { UserId } from '../../../decorator/userid.decorator';
import { CallCenterAuthGuard } from '../../../guards/auth.route.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('/call-center/account')
@ApiTags('Account')
@ApiBearerAuth()
export class AccountCallCenterController {
  constructor(
    private readonly service: AccountCallCenterService,
    private mail: ReactEmailService,
  ) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get the information about the account',
    description:
      'Return all the information about the account, the email is verified only if the call center was logged in before.',
  })
  @ApiResponse({
    status: 200,
    description: 'The call center account',
    type: AccountInformationResponse,
  })
  @UseGuards(CallCenterAuthGuard)
  async info(
    @UserId() userId: Types.ObjectId,
  ): Promise<AccountInformationResponse> {
    return this.service.info(userId);
  }

  @Post('/update/name')
  @ApiOperation({
    summary: 'Update the call center name',
    description:
      'Update the call center name, the name must be unique and not empty.',
  })
  @ApiResponse({
    status: 200,
    description: 'The call center name was updated.',
    type: SuccessMessage,
  })
  @UseGuards(CallCenterAuthGuard)
  async updateName(
    @UserId() userId: Types.ObjectId,
    @Body() body: UpdateNameRequest,
  ): Promise<SuccessMessage> {
    return this.service.updateName(userId, body);
  }

  @Post('/update/address')
  @ApiOperation({
    summary: 'Update the call center address',
    description: 'Update the call center address, the address must be unique.',
  })
  @ApiResponse({
    status: 200,
    description: 'The call center address was updated.',
    type: SuccessMessage,
  })
  @UseGuards(CallCenterAuthGuard)
  async updateAddress(
    @UserId() userId: Types.ObjectId,
    @Body() body: UpdateAddressRequest,
  ): Promise<SuccessMessage> {
    return this.service.updateAddress(userId, body);
  }

  @UseGuards(CallCenterAuthGuard)
  @Post('/profile-picture/upload')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessMessage,
    description: 'When you file was successfully uploaded or replaced.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'If your type of profile picture is not valid',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description:
      'If the file not respect the following format: pdf, jpg, jpeg or png or are bigger than 10 Mo.',
  })
  @ApiOperation({
    summary: 'Upload your profile picture',
    description: 'Upload your profile picture.',
  })
  @UseInterceptors(FilesInterceptor('file', 1))
  async uploadProfilePicture(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: '(jpg|jpeg|png)$', // Regex to valid only pdf, jpeg, jpg or png
        })
        .addMaxSizeValidator({
          maxSize: 1010000000, // 1OMo
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Array<Express.Multer.File>,
    @UserId() userId: Types.ObjectId,
  ): Promise<SuccessMessage> {
    return this.service.uploadProfilePicture(userId, file);
  }

  @UseGuards(CallCenterAuthGuard)
  @Delete('/profile-picture/delete')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SuccessMessage,
    description: 'When you file was successfully deleted.',
  })
  @ApiOperation({
    summary: 'Delete your profile picture',
    description: 'Delete your profile picture.',
  })
  async deleteProfilePicture(
    @UserId() userId: Types.ObjectId,
  ): Promise<SuccessMessage> {
    return this.service.deleteProfilePicture(userId);
  }
}
