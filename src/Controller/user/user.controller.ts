// src/user/user.controller.ts

import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UserService } from '../../service/user.service';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('signup')
    async signUp(@Body() body: { password: string; name?: string }): Promise<User> {
        const { password, name } = body;
        console.log(password, name, 'hihi')
        // 이미 등록된 이메일인지 확인
        const existingUser = await this.userService.findUserByName(name);
        if (existingUser) {
            throw new BadRequestException('이미 등록된 계정입니다.');
        }

        // 새로운 사용자 생성
        const newUser = await this.userService.createUser(password, name);

        return newUser;
    }
}
