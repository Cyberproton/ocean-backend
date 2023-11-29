import { Injectable } from '@nestjs/common';
import { RoleModel } from '../model';
import { RoleRepository } from '../repository';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepository) {}

  async findRoles() {
    return this.roleRepo.findMany();
  }

  async findRoleById(id: string) {
    return this.roleRepo.findById(id);
  }

  async findRolesByUserId(userId: number): Promise<RoleModel[]> {
    return this.roleRepo.findByUserId(userId);
  }
}
