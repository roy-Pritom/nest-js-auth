import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { sign } from 'jsonwebtoken';
import { AppError } from 'src/utils/errorHandler';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) { }

  // create user
  async createUser(payload: CreateUserDto): Promise<{ user: UserEntity }> {
    const userExists = await this.findUserByEmail(payload.email);
    // console.log(userExists)
    if (userExists) throw new BadRequestException("Email is not available")
    payload.password = await hash(payload.password, 10)
    let user = this.usersRepository.create(payload);
    user = await this.usersRepository.save(user)
    delete user.password;
    return { user };
  }

  // login user
  async login(payload: LoginUserDto): Promise<UserEntity> {
    const isUserExist = await this.usersRepository.createQueryBuilder('users').addSelect('users.password').where('users.email=:email', { email: payload.email }).getOne();
    if (!isUserExist) throw new BadRequestException("Bad Credentials")
    const matchPassword = await compare(payload.password, isUserExist.password);
    if (!matchPassword) AppError(HttpStatus.FORBIDDEN,"Bad Credentials")
    delete isUserExist.password
    return isUserExist
  }

  // get all users
  async getAllUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find({});
  }

  // get user by id
  async getUser(userId: number): Promise<UserEntity> {
    const user =await this.usersRepository.findOneBy({ id: userId })
    if(!user)  AppError(HttpStatus.NOT_FOUND,"user not exist!")
    return user;
  }





  // check user is exist or not
  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.findOneBy({ email })
  }

  // generate access token
  async accessToken(user: UserEntity): Promise<string> {
    return sign(
      { id: user.id, email: user?.email },
      // process.env.ACCESSTOKEN_SECRET,
      'gdwqjhyfg',
      { expiresIn: '1d' }
    )
  }



}
