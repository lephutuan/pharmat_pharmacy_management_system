import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import pool from "../config/database";
import { validateLogin } from "../utils/validator";
import { UnauthorizedError, AppError } from "../utils/errors";
import { logger } from "../utils/logger";

const router = express.Router();

// Login
router.post("/login", async (req, res, next) => {
  try {
    // Validate input
    const { email, password } = validateLogin(req.body);

    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    const users = rows as any[];
    const user = users[0];

    if (!user) {
      logger.warn('Login attempt failed: user not found', { email });
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      logger.warn('Login attempt failed: invalid password', { email, userId: user.id });
      throw new UnauthorizedError('Invalid credentials');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || jwtSecret === "your-secret-key") {
      logger.error('JWT_SECRET not configured');
      return res.status(500).json({ error: "Server configuration error" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: "7d" }
    );

    logger.info('User logged in successfully', { userId: user.id, email: user.email, role: user.role });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    logger.error('Login error', error);
    next(error);
  }
});

// Verify token
router.get("/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret === "your-secret-key") {
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
