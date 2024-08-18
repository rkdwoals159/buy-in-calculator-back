import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class GameService {
    constructor(private readonly prisma: PrismaService) { }

    // 게임 생성
    async createGame(id: string) {
        const existingGame = await this.prisma.game.findUnique({
            where: { id },
        });

        if (existingGame) {
            throw new ConflictException('이미 존재하는 게임 ID입니다.');
        }

        const newGame = await this.prisma.game.create({
            data: {
                id,
                title: '',
                totalBindFee: 0,
                settlementAmount: 0,
            },
        });
        console.log(newGame);
        return newGame;
    }

    // 게임 참가자 가져오기
    async getGameParticipants(gameId: string) {
        console.log(`Fetching participants for gameId: ${gameId}`); // 디버깅 로그

        const participants = await this.prisma.user.findMany({
            where: {
                buyins: {
                    some: {
                        gameId,
                    },
                },
            },
            include: {
                buyins: {
                    where: { gameId }, // 특정 게임 ID에 대한 buyins만 포함
                    include: {
                        items: true, // 필요한 경우 BuyinItem 포함
                    },
                },
            },
        });

        console.log(`Participants found: ${participants.length}`); // 디버깅 로그

        return participants.map((user) => ({
            id: user.id,
            name: user.name,
            totalBindCount: user.buyins.reduce((sum, buyin) => sum + buyin.items.reduce((itemSum, item) => itemSum + item.bindingCount, 0), 0), // 바인드 수의 합계
            totalBindFee: user.buyins.reduce((sum, buyin) => sum + buyin.items.reduce((itemSum, item) => itemSum + item.bindingFee, 0), 0),   // 바인드 비용의 합계
            totalSettlementAmount: user.buyins.reduce((sum, buyin) => sum + buyin.settlementAmount, 0), // 정산 금액의 합계
            buyins: user.buyins,
        }));
    }

    // 게임 ID로 게임 찾기
    async getGameById(id: string) {
        const game = await this.prisma.game.findUnique({
            where: { id },
        });
        if (!game) {
            throw new NotFoundException('게임을 찾을 수 없습니다.');
        }
        return game;
    }

    // BuyIn 추가
    async addBuyin(gameId: string, userId: number, bindCount: number, bindFee: number) {
        const game = await this.getGameById(gameId);
        if (!game) {
            throw new NotFoundException('게임을 찾을 수 없습니다.');
        }

        const buyin = await this.prisma.buyIn.create({
            data: {
                gameId,
                userId,
                settlementAmount: 0,
                items: {
                    create: [{
                        bindCount,
                        bindFee,
                    }],
                },
            },
        });

        // 게임의 총 바인비 업데이트
        await this.prisma.game.update({
            where: { id: gameId },
            data: { totalBindFee: game.totalBindFee + bindFee },
        });

        return buyin;
    }

    // 게임의 BuyIn 목록 가져오기
    async getBuyins(gameId: string) {
        const buyins = await this.prisma.buyIn.findMany({
            where: { gameId },
            orderBy: { createdAt: 'asc' },
            include: { user: true, items: true },
        });
        return buyins;
    }

    // 게임 정산
    async settleGame(gameId: string, amount: number) {
        const game = await this.getGameById(gameId);
        console.log(typeof game.settlementAmount, typeof amount);

        await this.prisma.game.update({
            where: { id: gameId },
            data: { settlementAmount: game.settlementAmount + Number(amount) },
        });

        return { message: '게임이 정산되었습니다.' };
    }
}
