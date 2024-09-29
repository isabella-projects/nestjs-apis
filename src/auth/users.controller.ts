import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './input/create.user.dto';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('users')
export class UsersController {
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    @Post()
    public async create(@Body() createUserDTO: CreateUserDTO) {
        const user = new User();

        if (createUserDTO.password !== createUserDTO.retypedPassword) {
            throw new BadRequestException(['Password are not identical']);
        }

        const existingUser = await this.userRepository.findOne({
            where: [
                { username: createUserDTO.username },
                { email: createUserDTO.email },
            ],
        });

        if (existingUser) {
            throw new BadRequestException([
                'Username or E-Mail is already taken',
            ]);
        }

        user.username = createUserDTO.username;
        user.password = await this.authService.hashPassword(
            createUserDTO.password,
        );
        user.email = createUserDTO.email;
        user.firstName = createUserDTO.firstName;
        user.lastName = createUserDTO.lastName;

        return {
            ...(await this.userRepository.save(user)),
            token: this.authService.getTokenForUser(user),
        };
    }
}
