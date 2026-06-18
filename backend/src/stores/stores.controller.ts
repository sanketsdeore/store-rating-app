import { Controller, Get, Query, Request, UseGuards } from "@nestjs/common";
import { JwtGuard } from "src/auth/guards/jwt/jwt.guard";
import { StoresService } from "./stores.service";

@Controller('stores')
@UseGuards(JwtGuard)
export class StoresController {
    constructor(
        private readonly storeService: StoresService
    ) {}

    @UseGuards(JwtGuard)
    @Get()
    getAllStores(@Request() req) {
        return this.storeService.getAllStores(req.user.userId);
    }

    @Get('search')
    @UseGuards(JwtGuard)
    searchStores(@Request() req, @Query('q') search: string) {
        return this.storeService.searchStores(req.user.userId, search);
    }
}
