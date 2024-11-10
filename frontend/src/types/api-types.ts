import { User } from "./types";

export type newUserMessageResponse={
    success:boolean;
    message:string
}
export type UserResponse={
    success:boolean;
    user:User
}