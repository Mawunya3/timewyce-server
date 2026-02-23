import { Router } from "express";
import * as Auth from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.get("/health", Auth.healthAuth);

// add these ✅
authRouter.post("/signup", Auth.signup);
authRouter.post("/signin", Auth.signin);
authRouter.post("/signout", Auth.signout);

authRouter.get("/google/url", Auth.googleUrl);
authRouter.get("/google/callback", Auth.googleCallback);

