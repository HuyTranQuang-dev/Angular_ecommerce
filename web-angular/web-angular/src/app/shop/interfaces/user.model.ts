export interface User {
    address: string;
    createDate: Date;
    fullname: string;
    id: number;
    password: string;
    phoneNumber: string;
    roles: Role[];
    username: string;
}

export enum Role {
    ADMIN = 'ADMIN', USER = 'USER',
}
