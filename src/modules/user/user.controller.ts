import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { Request } from 'express';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profiles')
  @UseGuards(JwtAuthGuard)
  async getProfiles() {}

  @Delete('soft')
  @UseGuards(JwtAuthGuard)
  async softDelete(@Req() req: Request) {
    return this.userService.softDelete(req.user as User);
  }
}
