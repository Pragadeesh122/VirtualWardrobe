import {Request, Response} from "express";
import {RegisterData, LoginCredentials} from "../types/auth";
import {authValidation} from "../validators/auth";
import {authService} from "../services/auth";

export const register = async (req: Request, res: Response) => {
  try {
    const validationResult = authValidation.register.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({error: validationResult.error.errors});
    }

    const registerData: RegisterData = req.body;
    const response = await authService.register(registerData);

    res.status(201).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({error: "An error occurred during registration"});
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validationResult = authValidation.login.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({error: validationResult.error.errors});
    }

    const loginCredentials: LoginCredentials = req.body;

    const response = await authService.login(loginCredentials);

    res.status(200).json(response);
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    res.status(401).json({error: "Invalid credentials"});
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const {refreshToken} = req.body;

    if (!refreshToken) {
      return res.status(400).json({error: "Refresh token is required"});
    }

    const response = await authService.refreshToken(refreshToken);
    res.status(200).json(response);
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(401).json({error: "Failed to refresh token"});
  }
};
