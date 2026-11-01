import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import pool from '../db.js';

const router = Router();

const COOKIE_NAME = 'cravebuddy_session';
const SESSION_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts. Please try again in a little while.',
  },
});

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_AGE_MS,
  };
}

function createSession(res, user) {
  const token = jwt.sign(
    {
      sub: String(user.id),
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
      issuer: 'cravebuddy',
    }
  );

  res.cookie(COOKIE_NAME, token, cookieOptions());
}

function publicUser(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
  };
}

// Middleware: check whether the user has a valid login session.
async function requireSession(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({
      message: 'Please log in to continue.',
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'cravebuddy',
    });

    const result = await pool.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1 LIMIT 1',
      [payload.sub]
    );

    if (result.rowCount === 0) {
      res.clearCookie(COOKIE_NAME, {
        ...cookieOptions(),
        maxAge: undefined,
      });

      return res.status(401).json({
        message: 'This session is no longer valid. Please log in again.',
      });
    }

    req.authUser = publicUser(result.rows[0]);
    next();
  } catch (error) {
    if (
      error?.name === 'JsonWebTokenError' ||
      error?.name === 'TokenExpiredError'
    ) {
      res.clearCookie(COOKIE_NAME, {
        ...cookieOptions(),
        maxAge: undefined,
      });

      return res.status(401).json({
        message: 'Your session has expired. Please log in again.',
      });
    }

    next(error);
  }
}

// POST /api/auth/register
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const name =
      typeof req.body.name === 'string' ? req.body.name.trim() : '';

    const email =
      typeof req.body.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';

    const password =
      typeof req.body.password === 'string' ? req.body.password : '';

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        message: 'Please enter a name between 2 and 100 characters.',
      });
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 255
    ) {
      return res.status(400).json({
        message: 'Please enter a valid email address.',
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        message: 'Password must be between 8 and 72 characters.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    );

    const user = publicUser(result.rows[0]);

    createSession(res, user);

    return res.status(201).json({
      message: 'Account created successfully.',
      user,
    });
  } catch (error) {
    // PostgreSQL error code 23505 means a unique value already exists.
    if (error.code === '23505') {
      return res.status(409).json({
        message:
          'An account with this email already exists. Please log in instead.',
      });
    }

    next(error);
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const email =
      typeof req.body.email === 'string'
        ? req.body.email.trim().toLowerCase()
        : '';

    const password =
      typeof req.body.password === 'string' ? req.body.password : '';

    if (!email || !password) {
      return res.status(400).json({
        message: 'Enter your email address and password.',
      });
    }

    const result = await pool.query(
      `SELECT id, name, email, password_hash, created_at
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        message: 'Incorrect email or password.',
      });
    }

    const row = result.rows[0];

    const matches = await bcrypt.compare(password, row.password_hash);

    if (!matches) {
      return res.status(401).json({
        message: 'Incorrect email or password.',
      });
    }

    const user = publicUser(row);

    createSession(res, user);

    return res.json({
      message: 'Signed in successfully.',
      user,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
// Return the currently logged-in user's details.
router.get('/me', requireSession, (req, res) => {
  res.json({
    user: req.authUser,
  });
});

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME, {
    ...cookieOptions(),
    maxAge: undefined,
  });

  res.json({
    message: 'Logged out successfully.',
  });
});

export default router;
