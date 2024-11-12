
import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

declare global{
    namespace Express{
        interface Request{
            currentUser?:UserEntity
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private readonly userService:UsersService){}
   async use(req: Request, res: Response, next: NextFunction) {
        // console.log(req)
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer')) {
            req.currentUser=null;
            next()
            return;
        }
        else {
       try{
             // console.log(authHeader)
             const token = authHeader.split(' ')[1]
             const {id}=<JwtPayload>verify(token,'gdwqjhyfg');
             const currentUser=await this.userService.getUser(+id)
             req.currentUser=currentUser;
             next()
       }
       catch(err){
        req.currentUser=null;
          next();
       }
        }
       
    }
}


interface JwtPayload{
    id:string;
}