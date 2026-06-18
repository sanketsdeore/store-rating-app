import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorators';

@Controller('owner')
export class OwnerController {
    constructor(
        private readonly ownerService: OwnerService
    ) {}

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('STORE_OWNER')
    @Get('dashboard')
    getDashboardStats(@Request() req) {
        return this.ownerService.getDashboard(req.user.userId);
    }
}
