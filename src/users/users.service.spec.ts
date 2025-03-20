import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Role } from '../roles/role.entity'; // Ensure correct path

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            save: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockImplementation((dto) => dto),
          },
        },
        {
          provide: getRepositoryToken(Role),
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Admin' }), // Mock role
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('should create a user with a valid roleId', async () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'test@example.com',
      password: 'hashedPassword',
      roleId: 1, // Foreign key reference
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    jest
      .spyOn(roleRepository, 'findOne')
      .mockResolvedValue({ id: 1, name: 'Admin' });
    jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

    const result = await service.register({
      name: 'John Doe',
      email: 'test@example.com',
      password: 'hashedPassword',
      roleId: 1, // Pass roleId instead of role
    });

    expect(result).toEqual(mockUser);
    expect(roleRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(userRepository.save).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'test@example.com',
      password: 'hashedPassword',
      roleId: 1,
    });
  });
});
