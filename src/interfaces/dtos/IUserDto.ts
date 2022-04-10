interface IUserDto {
  _id?: string;
  name: string;
  email: string;
  password: string;
  photo?: string;
  role?: 'user' | 'guide' | 'lead-guide' | 'admin';
}

interface IPartialUserDto {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  photo?: string;
}

interface IUserWithoutPassword {
  _id: string;
  name: string;
  email: string;
  photo?: string;
  role: 'user' | 'guide' | 'lead-guide' | 'admin';
}

interface IUserAndToken {
  user: IUserWithoutPassword;
  token: string;
}

export { IUserDto, IPartialUserDto, IUserWithoutPassword, IUserAndToken };
