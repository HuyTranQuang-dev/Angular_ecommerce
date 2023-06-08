import {User} from './user.model';

export interface LoginResponse {
    httpStatus: string;
    msg: string;
    userDTO: User;
    token: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}
