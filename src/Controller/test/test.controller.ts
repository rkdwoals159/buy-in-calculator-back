import { Controller, Get, Header, HttpCode, Post, Query, Redirect, Req } from '@nestjs/common';
import { TestService } from '../../service/test.service'

@Controller('/test')
export class TestController {
    constructor(private readonly testService: TestService) { }
    @Get('/cats')
    getHello(): string {
        return this.testService.getTest();
    }
    // @Post()
    // @HttpCode(204)
    // @Header('Cache-Control', 'none') create(): string {
    //     return 'This action adds a new cat';
    // }

    // @Get('/')
    // findAll(@Req() request: Request): string {
    //     return 'This action returns all cats'
    // }
    // @Get('ab*cd')
    // findAll2() {
    //     return 'This route uses a wildcard';
    // }

    // @Get('docs')
    // @Redirect('https://docs.nestjs.com', 302)
    // getDocs(@Query('version') version) {
    //     if (version && version === '5') {
    //         return { url: 'https://docs.nestjs.com/v5/' };
    //     }
    // }

}
