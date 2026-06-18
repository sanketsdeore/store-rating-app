import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt/jwt.guard';
import { CreateRatingDto } from './dto/create-rating.dto';
import { RatingsService } from './ratings.service';

@Controller('ratings')
export class RatingsController {
    constructor(
        private readonly ratingsService: RatingsService
    ) {}
    
    @Post()
    @UseGuards(JwtGuard)
    submitRating(
        @Request() req,
        @Body() dto: CreateRatingDto
    ) {
        return this.ratingsService.submitRating(req.user.userId, dto.storeId, dto.rating);
    }
}
