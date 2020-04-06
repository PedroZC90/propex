import { Service } from "@tsed/common";
import { Secret, SignOptions, VerifyErrors, sign, verify } from "jsonwebtoken";
import { BadRequest } from "ts-httpexceptions";

import { User } from "../../models/User";
import { UserRepository } from "../../repositories/UserRepository";

const JWT_SECRET_KEY: string | undefined = process.env.JWT_SECRET_KEY;
const JWT_EXPIRATION: number = 1 * 60 * 60; // seconds

@Service()
export class AuthenticationService {

    constructor(private userRepository: UserRepository) {}

    /**
     * Find user by credentials.
     * @param username  -- username inserted on login form.
     * @param password  -- password inserted on login form.
     */
    public async findByCredentials(username: string, password: string): Promise<User | undefined> {
        return this.userRepository.findByCredentials(username, password);
    }

    /**
     * Register a new user.
     * @param user      -- user information.
     */
    public async register(user: User): Promise<User | null> {
        return this.userRepository.save(user);
    }

    /**
     * Sign Jwt token with user data.
     * @param user      -- user data.
     */
    public async signJwtToken(user: User): Promise<string | null> {
        if (!JWT_SECRET_KEY) return null;

        const now: number = Math.floor(Date.now() / 1000);
        const payload: any = {
            id: user.id,
            role: user.role,
            iat: now
            // exp: now + JWT_EXPIRATION
        };
        const secret: Secret = JWT_SECRET_KEY;
        const options: SignOptions = {
            // algorithm: "RS256",
            expiresIn: JWT_EXPIRATION || "1h"
        };
        return new Promise((resolve, reject) => {
            sign(payload, secret, options, (err: Error, token: string): void => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        });
    }

    /**
     * Verify if jwt token is valid.
     * @param token
     */
    public async verifyJwtToken(token: string): Promise<any> {
        if (!JWT_SECRET_KEY) return;
        return new Promise((resolve, reject) => {
            verify(this.getJwtToken(token), JWT_SECRET_KEY, (err: VerifyErrors, decoded: object | string): any => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    }

    /**
     * Retrieve token from 'Authorization' request header.
     * @param token -- Jwt Token
     */
    public getJwtToken(token: string): string {
        const words: string[] = token.split(" ");
        if (words[0] !== "Bearer") {
            throw new BadRequest("Token do not start with 'Bearer'");
        }
        return words[1];
        // return token.substring(("Bearer").length).trim();
    }

    /**
     * Set token to 'Authorization' request header.
     * @param token -- Jwt Token
     */
    public setJwtToken(token: string): string {
        return `Bearer ${token}`;
    }

}
