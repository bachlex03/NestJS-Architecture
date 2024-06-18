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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Request } from 'express';
import { LocalAuthGuard } from 'src/cores/guards/local-auth.guard';
import { User } from '../user/entities/user.entity';

@Controller('auth')
@ApiTags('auth')
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
}
