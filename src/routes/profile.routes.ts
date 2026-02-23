import {   Router } from "express";
import * as profile from "../controllers/profile.controller";

export const meRouter = Router();



meRouter.get("/profile", profile.profile);
meRouter.post("/profile", profile.editProfile);