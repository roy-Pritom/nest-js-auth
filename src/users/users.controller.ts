import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeRoles } from 'src/common/decorators/authorize-roles.decorator';
import { Roles } from 'src/utils/common/user.roles.enum';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // register
  @Post('register')
  createUser(@Body() payload: CreateUserDto): Promise<{ user: UserEntity }> {
    return this.usersService.createUser(payload)
  }

  // login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() payload: LoginUserDto): Promise<{
    statusCode: HttpStatus;
    success: boolean;
    message: string;
    data: {
      accessToken: string;
      user: UserEntity;
    };
  }> {
    const user = await this.usersService.login(payload);
    const accessToken = await this.usersService.accessToken(user);
    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: "User login successfully",
      data: { accessToken, user }
    }
  }

  // get all users
  @AuthorizeRoles(Roles.ADMIN,Roles.USER)
  @UseGuards(AuthenticationGuard,AuthorizeGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUser(): Promise<UserEntity[]> {
    return this.usersService.getAllUsers();
  }

  // get user by id
  @Get('single/:userId')
  @HttpCode(HttpStatus.OK)
  async getUser(@Param('userId') userId:number):Promise<UserEntity>{
  return this.usersService.getUser(userId);
  }

  // get login user profile
  @UseGuards(AuthenticationGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getProfile(@CurrentUser() currentUser : UserEntity){
      return currentUser;
  }


}
