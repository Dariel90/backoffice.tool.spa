export class LoginResultDto{
    user: LoginResultDto;
    token: string;
}

export class LogedUserInfo{
    firstName: string;
    lastName: string;
    creationDate: Date;
    sourceId: number | null;
}