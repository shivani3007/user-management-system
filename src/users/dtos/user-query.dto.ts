import {
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsString,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UserQueryDto {
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page: number;

  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  limit: number;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsIn(['createdAt', 'name', 'email'])
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'Order must be ASC or DESC' })
  order: 'ASC' | 'DESC' = 'DESC';
}
