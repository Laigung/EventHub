export interface IUser {
    userAddress: string;
    userName: string;
    age: number;
}

export interface IEvent {
    eventID: BigInt;
    eventName: string;
    description: string;
    date: BigInt;
    venue: string;
    maxParticipants: BigInt;
    ageLimit: BigInt;
    fee: BigInt;
    admin: IUser;
    participants: string[];
}