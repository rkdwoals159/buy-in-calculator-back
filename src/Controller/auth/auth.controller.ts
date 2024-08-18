// src/auth/auth.controller.ts

import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/service/user.service'
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService) { }

    @Post('login')
    async login(@Body() body: { name: string; password: string }): Promise<User> {
        const { name, password } = body;

        try {
            // 사용자 인증
            const user = await this.userService.validateUser(name, password);
            return user;
        } catch (error) {
            throw new UnauthorizedException('로그인 실패');
        }
    }
}