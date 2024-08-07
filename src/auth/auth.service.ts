import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userSignInDto } from 'src/auth/dto/user-signin.dto';
import { createuserdto } from 'src/plazeruser/dto/create-newuser.dto';
import { PlazeruserService } from 'src/plazeruser/plazeruser.service';
import { Plazeruser } from 'src/plazeruser/entities/plazeruser.entity';
import { Public } from 'src/utility/common/public.decorators';

@Injectable()
export class AuthService {
  constructor(
    private plazeruserservice: PlazeruserService,
    private jwtservice: JwtService,
  ) { }

  async validateUser(
    username: string,
    userpassword: string,
  ): Promise<Plazeruser | null> {
    const user = await this.plazeruserservice.findUserByUserName(username);
    console.log('Validating user:', { username, userpassword });
    console.log('User after validation', user.userPassword);
    if (user.userPassword === userpassword) {
      return user;
    }
    return null;
  }

  async signIn(userSignInDto: userSignInDto): Promise<any> {
    console.log('Signing in with', userSignInDto);
    const user = await this.validateUser(
      userSignInDto.userName,
      userSignInDto.userpassword,
    );
    console.log('User after validation', user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = {
      sub: user.userId,
      username: user.userName,
      roles: [user.role],
      email: user.Email,
      addressL1: user.AddressL1,
      addressL2: user.AddressL2,
      addressL3: user.AddressL3,
      skills: user.skills,
      DoB: user.DoB,
      gender: user.gender,
      active: user.active,
      image: user.image,
      gitLink: user.gitlink,
      phone: user.phone,
    };
    const access_token = await this.jwtservice.signAsync(payload);
    return { token: access_token };
  }

  async register(CreateuserDto: createuserdto): Promise<any> {
    console.log('Registering user with', CreateuserDto);

    const user = await this.plazeruserservice.findUserByUserName(
      CreateuserDto.userName,
    );
    if (user) {
      throw new UnauthorizedException('User found');
    }
    const newuser = this.plazeruserservice.createnewuser(CreateuserDto);
    return newuser;
  }
}
