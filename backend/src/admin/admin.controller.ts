import { Controller, Post, Body, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateStoreOwnerDto } from './dto/create-store-owner.dto';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
    constructor(
        private readonly adminService: AdminService
    ) {}

    @Post('store-owner')
    createStoreOwner(@Body() dto: CreateStoreOwnerDto) {
        return this.adminService.createStoreOwner(dto);
    }

    @Roles('ADMIN')
    @UseGuards(JwtGuard, RolesGuard)
    @Get('dashboard')
    getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('users')
    getAllUsers() {
        return this.adminService.getAllUsers();
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('stores')
    getAllStores() {
        return this.adminService.getAllStores();
    }

    @Post('users')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    createUser(@Body() dto: CreateUserDto) {
        return this.adminService.createUser(dto);
    }
}
