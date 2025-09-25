import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'generated/prisma';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(private readonly prismaService: PrismaService) { }

    async createUser(data: CreateUserRequest) {

        try {
            return await this.prismaService.user.create({
                data: {
                    ...data,
                    password: await bcrypt.hash(data.password, 10),
                },
                select: {
                    id: true,
                    email: true,
                },
            });
        } catch (err) {
            console.error(err);
            if (err.code === 'P2002') {
                throw new UnprocessableEntityException('User already exists');
            }
            throw err
        }

    }
}
