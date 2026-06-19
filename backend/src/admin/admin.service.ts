import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreOwnerDto } from './dto/create-store-owner.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AdminService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createStoreOwner(storeOwnerDto: CreateStoreOwnerDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: storeOwnerDto.email,
            },
        });

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(storeOwnerDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                name: storeOwnerDto.name,
                email: storeOwnerDto.email,
                address: storeOwnerDto.address,
                password: hashedPassword,
                role: Role.STORE_OWNER,
                store: {
                    create: {
                        name: storeOwnerDto.storeName,
                        address: storeOwnerDto.storeAddress,
                        email: storeOwnerDto.email
                    }
                }
            }
        });

        const { password, ...result } = user;
        return result;
    }

    async getDashboardStats() {
        const totalUsers = await this.prisma.user.count();

        const totalStores = await this.prisma.store.count();

        const totalRatings = await this.prisma.rating.count();

        return {
            totalUsers,
            totalStores,
            totalRatings
        }
    }

    async getAllUsers() {
        const users = await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                createdAt: true,
                store: {
                    select: {
                        ratings: {
                            select: {
                                rating: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return users.map((user) => {
            let averageRating: number | null = null;
            if (user.role === Role.STORE_OWNER && user.store) {
                const ratings = user.store.ratings;
                averageRating =
                    ratings.length > 0
                    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
                    : 0;
            }
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                address: user.address,
                role: user.role,
                createdAt: user.createdAt,
                averageRating
            };
        });
    }

    async getAllStores() {
        const stores = await this.prisma.store.findMany({
            include: {
                ratings: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return stores.map((store) => {
            const averageRating =
                store.ratings.length > 0
                ? store.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
                store.ratings.length
                : 0;

            return {
                id: store.id,
                name: store.name,
                address: store.address,
                email: store.email,
                owner: store.owner,
                averageRating
            };
        });
    }

    async createUser(dto: CreateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });

        if(existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                address: dto.address,
                password: hashedPassword,
                role: dto.role || Role.USER
            }
        });

        const { password, ...result } = user;
        return result;
    }
}
