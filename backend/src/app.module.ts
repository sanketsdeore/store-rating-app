import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { RatingsModule } from './ratings/ratings.module';
import { StoresModule } from './stores/stores.module';
import { OwnerModule } from './owner/owner.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, AdminModule, RatingsModule, StoresModule, OwnerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
