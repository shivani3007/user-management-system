import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../roles/role.entity';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('should create a user', async () => {
    const mockRole = { id: 1, name: 'user', users: [] };
    jest
      .spyOn(roleRepository, 'findOne')
      .mockResolvedValue(Promise.resolve(mockRole));

    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'test@example.com',
      password: await bcrypt.hash('password', 10),
      role: mockRole,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(userRepository, 'save').mockResolvedValue({
      ...mockUser,
      hashPassword: jest.fn(),
    });

    const result = await usersService.register({
      name: 'John Doe',
      email: 'test@example.com',
      password: 'password',
    });

    expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'dsnfddgvbfdnvfgv',
        role: mockRole,
      }),
    );
    expect(result).toEqual(expect.objectContaining(mockUser));
  });
});
