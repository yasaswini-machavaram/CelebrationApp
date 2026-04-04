import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
const COOKIE_NAME = 'auth_token';
const ADMIN_COOKIE_NAME = 'admin_token';
const ADMIN_SESSION_SECONDS = 10 * 60; // 10 minutes

// ─── Token operations ─────────────────────────────────────────────

export function signToken(userId, role = 'user') {
  const expiresIn = role === 'admin' ? ADMIN_SESSION_SECONDS : '7d';
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// ─── Cookie helpers ───────────────────────────────────────────────

export function setAuthCookie(token, isAdmin = false) {
  const cookieStore = cookies();
  const name = isAdmin ? ADMIN_COOKIE_NAME : COOKIE_NAME;
  const maxAge = isAdmin ? ADMIN_SESSION_SECONDS : 7 * 24 * 60 * 60;
  cookieStore.set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });
}

export function clearAuthCookie(isAdmin = false) {
  const cookieStore = cookies();
  const name = isAdmin ? ADMIN_COOKIE_NAME : COOKIE_NAME;
  cookieStore.set(name, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

// ─── Request auth extraction ──────────────────────────────────────

export function getAuthUser(request) {
  // Try from cookie header
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  return verifyToken(match[1]);
}

export function getAdminUser(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${ADMIN_COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  const decoded = verifyToken(match[1]);
  if (!decoded || decoded.role !== 'admin') return null;
  return decoded;
}

export function requireAuth(request) {
  const user = getAuthUser(request);
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export function requireAdmin(request) {
  const admin = getAdminUser(request);
  if (!admin) {
    throw new Error('UNAUTHORIZED');
  }
  return admin;
}
