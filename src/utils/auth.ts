/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AdminCredentials {
  username: string;
  password: string;
  updatedAt: string;
}

export interface AdminSession {
  loggedIn: boolean;
  username: string;
  loginTime: string;
  rememberMe: boolean;
}

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  password: 'admin123',
  updatedAt: '2026-11-09T00:00:00.000Z',
};

const CREDENTIALS_KEY = 'sarpras_admin_credentials';
const SESSION_KEY = 'sarpras_admin_session';

/**
 * Retrieves current admin credentials from storage or returns default
 */
export function getStoredAdminCredentials(): AdminCredentials {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_ADMIN_CREDENTIALS;
  }

  const stored = localStorage.getItem(CREDENTIALS_KEY);
  if (!stored) {
    return DEFAULT_ADMIN_CREDENTIALS;
  }

  try {
    const parsed = JSON.parse(stored);
    if (parsed && typeof parsed.username === 'string' && typeof parsed.password === 'string') {
      return parsed;
    }
  } catch {
    // fallback to default
  }

  return DEFAULT_ADMIN_CREDENTIALS;
}

/**
 * Validates admin credentials attempt
 */
export function verifyAdminCredentials(
  usernameAttempt: string,
  passwordAttempt: string
): { success: boolean; error?: string } {
  const trimmedUser = (usernameAttempt || '').trim();
  const trimmedPass = (passwordAttempt || '').trim();

  if (!trimmedUser) {
    return { success: false, error: 'Username admin tidak boleh kosong.' };
  }

  if (!trimmedPass) {
    return { success: false, error: 'Password admin tidak boleh kosong.' };
  }

  const current = getStoredAdminCredentials();

  // Case-insensitive username check, exact password check
  if (
    current.username.toLowerCase() === trimmedUser.toLowerCase() &&
    current.password === trimmedPass
  ) {
    return { success: true };
  }

  return {
    success: false,
    error: 'Username atau password admin salah. Silakan periksa kembali kredensial Anda.',
  };
}

/**
 * Updates admin password
 */
export function updateAdminPassword(
  oldPasswordAttempt: string,
  newPassword: string,
  confirmNewPassword: string
): { success: boolean; error?: string } {
  const current = getStoredAdminCredentials();

  if (!oldPasswordAttempt || current.password !== oldPasswordAttempt.trim()) {
    return { success: false, error: 'Password lama yang dimasukkan tidak sesuai.' };
  }

  const trimmedNew = (newPassword || '').trim();
  const trimmedConfirm = (confirmNewPassword || '').trim();

  if (trimmedNew.length < 5) {
    return { success: false, error: 'Password baru minimal harus terdiri dari 5 karakter.' };
  }

  if (trimmedNew !== trimmedConfirm) {
    return { success: false, error: 'Konfirmasi password baru tidak cocok.' };
  }

  const updated: AdminCredentials = {
    ...current,
    password: trimmedNew,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(updated));
  }

  return { success: true };
}

/**
 * Saves active admin session
 */
export function saveAdminSession(username: string, rememberMe: boolean = true): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  const session: AdminSession = {
    loggedIn: true,
    username,
    loginTime: new Date().toISOString(),
    rememberMe,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Retrieves existing admin session
 */
export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;

  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    const session: AdminSession = JSON.parse(stored);
    if (session && session.loggedIn) {
      return session;
    }
  } catch {
    // invalid session
  }

  return null;
}

/**
 * Clears admin session upon logout
 */
export function clearAdminSession(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Resets admin credentials to default (for emergency/recovery)
 */
export function resetAdminCredentialsToDefault(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(DEFAULT_ADMIN_CREDENTIALS));
}
