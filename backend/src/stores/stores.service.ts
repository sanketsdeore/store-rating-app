import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StoresService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async getAllStores(userId: number) {
        const stores = await this.prisma.store.findMany({
            include: {
                ratings: true
            }
        });

        return stores.map((store) => {
            const overallRating = store.ratings.length > 0
            ? store.ratings.reduce((sum, r) => sum + r.rating, 0) /
            store.ratings.length
            : 0;

            const userRating = store.ratings.find((rating) => rating.userId === userId);

            return {
                id: store.id,
                name: store.name,
                address: store.address,
                overallRating,
                userRating: userRating?.rating || 0
            }
        })
    }

    async searchStores(userId: number, search: string) {
        const stores = await this.prisma.store.findMany({
            where: {
                OR: [
                    {name: {contains: search, mode: 'insensitive'}},
                    {address: {contains: search, mode: 'insensitive'}}
                ]
            },
            include: {
                ratings: true
            }
        });

        return stores.map((store) => {
            const overallRating = store.ratings.length > 0
            ? store.ratings.reduce((sum, r) => sum + r.rating, 0) /
            store.ratings.length
            : 0;

            const userRating = store.ratings.find((rating) => rating.userId === userId);

            return {
                id: store.id,
                name: store.name,
                address: store.address,
                overallRating,
                userRating: userRating?.rating || 0
            }
        })
    }
}
