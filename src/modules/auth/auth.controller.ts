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
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Request } from 'express';
import { LocalAuthGuard } from 'src/cores/guards/local-auth.guard';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from 'src/cores/guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
// @ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiBody({ type: SignUpDto })
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignInDto })
  async signIn(@Req() req: Request) {
    return this.authService.signIn(req.user as User);
  }

  // @Delete('soft')
  // @UseGuards(JwtAuthGuard)
  // async softDelete(@Req() req: Request) {
  //   return this.authService.softDeleteUser();
  // }
}
