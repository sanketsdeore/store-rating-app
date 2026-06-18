import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingsService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async submitRating(userId: number, storeId: number, rating: number) {
        return this.prisma.rating.upsert({
            where: {
                userId_storeId: {
                    userId,
                    storeId
                }
            },
            update: {
                rating
            },
            create: {
                userId,
                storeId,
                rating
            }
        })
    }
}
