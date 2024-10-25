import {Request} from "express";

export interface AuthUser {
  uid: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user?: AuthUser;
}
