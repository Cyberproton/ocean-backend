import { Injectable } from '@nestjs/common';
import { UniqueConstraintException } from 'src/common/exception';
import { CreateUserDto } from '../dto';
import { UsernameIsAlreadyTaken } from '../exception';
import { User } from '../model';
import { UserRepository } from '../repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async findUserById(id: number): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  async findUserByUsername(username: string): Promise<User | null> {
    return this.userRepo.findByUsername(username);
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    try {
      return this.userRepo.create(dto);
    } catch (e) {
      if (
        e instanceof UniqueConstraintException &&
        e.target.includes('username')
      ) {
        throw new UsernameIsAlreadyTaken();
      }
      throw e;
    }
  }
}
