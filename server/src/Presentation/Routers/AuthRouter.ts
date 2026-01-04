import { Router } from "express";

export const AuthRouter = Router();

AuthRouter.get("/test", (req, res) => {
  res.status(200).json({ message: "Auth Router is working" });
});

AuthRouter.post("/login", (req, res) => {
  res.status(200).json({ message: "Login successful" });
});

AuthRouter.post("/register", (req, res) => {
  res.status(201).json({ message: "Registration successful" });
});
