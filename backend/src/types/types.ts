import { IAuthOptions } from "@tsed/common";

import { User, Permission } from "../entities";
import { Role } from "./enums";

// --------------------------------------------------
// GENERAL:
// --------------------------------------------------
export interface IOptions {
    page?: number;
    rpp?: number;
    q?: string;
}

export interface IEntity {
    id?: number | string;
}

export interface IContext {
    user?: User;
    permissions?: Permission[];
}

// --------------------------------------------------
// AUTHENTICATION:
// --------------------------------------------------
export interface IJwt {
    id: number | string;
    role: Role;
    iat: number;
    exp: number;
}

export interface IToken {
    token?: string;
    role?: Role;
}

export interface ICustomAuthOptions extends IAuthOptions {
    role?: Role;
    scope?: Role[];
}
