export interface RegisterUserDto{
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    sourceId: number | null;
}