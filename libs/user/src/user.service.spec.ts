import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '@app/prisma';
import { CreateUserDto } from '@app/common-dtos/dto/create-user.dto';
import { UpdateUserDto } from '@app/common-dtos/dto/update-user.dto';

const mockPrismaService = {
  user: {
    create: jest.fn().mockResolvedValue({ id: 1 }),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user and return an id', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      };

      const result = await service.createUser(createUserDto);
      expect(result).toEqual({ id: 1 });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
        select: { id: true },
      });
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, email: 'testuser@example.com', name: 'Test User' };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.getUserByEmail('testuser@example.com');
      expect(result).toEqual(user);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'testuser@example.com' },
      });
    });

    it('should return null if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.getUserByEmail('notfound@example.com');
      expect(result).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, email: 'testuser@example.com', name: 'Test User' };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.getUserById(1);
      expect(result).toEqual(user);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('updateUserProfile', () => {
    it('should update user information', async () => {
      const updatedUserInfo: UpdateUserDto = {
        name: 'Updated Name',
        email: 'updatedemail@example.com',
      };

      const updatedUser = { id: 1, ...updatedUserInfo };

      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateUserProfile(1, updatedUserInfo);
      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatedUserInfo,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user by id', async () => {
      mockPrismaService.user.delete.mockResolvedValue({ id: 1 });

      const result = await service.deleteUser(1);
      expect(result).toEqual({ id: 1 });
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
