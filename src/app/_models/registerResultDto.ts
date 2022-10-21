export interface UserDetailsResponse {
    username: string;
    firstName: string;
    lastName: string;
    creationDate: string;
    lastUpdate: string;
    source: SourceDetails;
    roles: string[];
}

export interface SourceDetails{
    id: number,
    name: string
}