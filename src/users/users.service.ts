import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { Role } from '../roles/role.entity';
import { Role as roleEnums } from '../common/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException(EMAIL_ALREADY_EXISTS);
    }

    const userRole = await this.roleRepository.findOne({
      where: { name: roleEnums.USER },
    });
    if (!userRole) {
      throw new BadRequestException('Default "User" role not found');
    }

    const newUser = this.userRepository.create({
      name,
      email,
      password: password,
      role: userRole,
    });

    return this.userRepository.save(newUser);
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { role, email, name, password } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException(EMAIL_ALREADY_EXISTS);
    }

    const userRole = await this.roleRepository.findOne({
      where: { name: role },
    });
    if (!userRole) {
      throw new BadRequestException('Role not found');
    }

    const newUser = {
      name,
      email,
      password: password,
      role: userRole,
    };

    const user = this.userRepository.create(newUser);
    return this.userRepository.save(user);
  }

  async getUsers(params: {
    page: number;
    limit: number;
    role?: string;
    email?: string;
    sortBy: string;
    order: 'ASC' | 'DESC';
  }) {
    console.log('params', params);
    const { page, limit, role, email, sortBy, order } = params;
    const skip = (page - 1) * limit;

    const query = this.userRepository.createQueryBuilder('user');
    // Filtering
    if (role) {
      const roleEntity = await this.roleRepository.findOne({
        where: { name: role },
      });
      if (!roleEntity) {
        throw new NotFoundException(`Role '${role}' not found`);
      }
      query.andWhere('user.roleId = :roleId', { roleId: roleEntity.id });
    }
    if (email)
      query.andWhere('user.email ILIKE :email', { email: `%${email}%` });

    // Sorting
    query.orderBy(`user.${sortBy}`, order).skip(skip).take(limit);

    console.log(query.getQueryAndParameters());

    const [users, total] = await query.getManyAndCount();

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: users,
    };
  }
}
