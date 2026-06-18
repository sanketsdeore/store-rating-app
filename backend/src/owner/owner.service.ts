import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OwnerService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async getDashboard(ownerId: number) {
        const store = await this.prisma.store.findUnique({
            where: {
                ownerId
            },
            include: {
                ratings: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        })

        if(!store) {
            return {
                message: 'Store not found'
            }
        }

        const averageRating = store.ratings.length > 0 ? 
            store.ratings.reduce((acc, r) => acc + r.rating, 0) / store.ratings.length : 0;
        
        return {
            storeId: store.id,
            storeName: store.name,
            averageRating,
            ratings: store.ratings.map((rating) => ({
                rating: rating.rating,
                user: rating.user
            }))
        }
    }
}
