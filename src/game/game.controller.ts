import { Controller, Post, Get, Param, Body, Patch } from '@nestjs/common';
import { GameService } from './game.service'; // 경로를 프로젝트 구조에 맞게 조정하세요

@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) { }

    @Post()
    async createGame(@Body('id') id: string) {
        return this.gameService.createGame(id);
    }

    @Get(':id')
    async getGameById(@Param('id') id: string) {
        return this.gameService.getGameById(id);
    }
    @Post(':id/buyins')
    async addBuyin(@Param('id') gameId: string, @Body('amount') amount: number, @Body('bindCount') bindCount: number, @Body('userId') userId: number) {
        return this.gameService.addBuyin(gameId, userId, bindCount, amount);
    }

    @Get(':id/buyins')
    async getBuyins(@Param('id') gameId: string) {
        return this.gameService.getBuyins(gameId);
    }

    @Patch(':id/settle/:amount')
    async settleGame(@Param('id') gameId: string, @Param('amount') amount: number) {
        return this.gameService.settleGame(gameId, amount);
    }
    @Get(':id/participants')
    async getGameParticipants(@Param('id') gameId: string) {
        return this.gameService.getGameParticipants(gameId);
    }
}
