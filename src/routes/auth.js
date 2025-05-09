import express from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { validateSignUpData } from "../utils/validateSignUpData.js";
import requireAuth from "../middlewares/requireAuth.js";
const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    validateSignUpData({ firstName, lastName, email, password });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      throw new Error("User not found!");
    }
    const isPasswordValid = await user.validatePassword(password); // schema instance method

    if (!isPasswordValid) {
      throw new Error("Invalid password!");
    }
    user.password = undefined; //clean up the added password
    const token = await user.getJWT(); // schema instance method
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.json({ message: "User login successfully!", data: user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({
      message: "An error occurred during login. Please try again later.",
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.status(200).json({ message: "User logout successfully!" });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ message: "User authenticated successfully!", data: user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default authRouter;
