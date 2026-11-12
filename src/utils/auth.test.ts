import test from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyAdminCredentials,
  updateAdminPassword,
  DEFAULT_ADMIN_CREDENTIALS,
} from './auth';

test('verifyAdminCredentials succeeds with default admin credentials', () => {
  const result = verifyAdminCredentials(
    DEFAULT_ADMIN_CREDENTIALS.username,
    DEFAULT_ADMIN_CREDENTIALS.password
  );
  assert.equal(result.success, true);
  assert.equal(result.error, undefined);
});

test('verifyAdminCredentials supports case-insensitive username matching', () => {
  const result1 = verifyAdminCredentials('Admin', 'admin123');
  const result2 = verifyAdminCredentials('ADMIN', 'admin123');
  assert.equal(result1.success, true);
  assert.equal(result2.success, true);
});

test('verifyAdminCredentials rejects incorrect password', () => {
  const result = verifyAdminCredentials('admin', 'wrong_password');
  assert.equal(result.success, false);
  assert.match(result.error || '', /Username atau password admin salah/i);
});

test('verifyAdminCredentials rejects non-existent username', () => {
  const result = verifyAdminCredentials('user_biasa', 'admin123');
  assert.equal(result.success, false);
  assert.match(result.error || '', /Username atau password admin salah/i);
});

test('verifyAdminCredentials rejects empty username or password', () => {
  const result1 = verifyAdminCredentials('', 'admin123');
  assert.equal(result1.success, false);
  assert.match(result1.error || '', /Username admin tidak boleh kosong/i);

  const result2 = verifyAdminCredentials('admin', '');
  assert.equal(result2.success, false);
  assert.match(result2.error || '', /Password admin tidak boleh kosong/i);
});

test('updateAdminPassword rejects incorrect old password', () => {
  const result = updateAdminPassword('passwordsalah', 'barupassword123', 'barupassword123');
  assert.equal(result.success, false);
  assert.match(result.error || '', /Password lama yang dimasukkan tidak sesuai/i);
});

test('updateAdminPassword rejects new password shorter than 5 characters', () => {
  const result = updateAdminPassword(DEFAULT_ADMIN_CREDENTIALS.password, '123', '123');
  assert.equal(result.success, false);
  assert.match(result.error || '', /minimal harus terdiri dari 5 karakter/i);
});

test('updateAdminPassword rejects mismatched confirmation password', () => {
  const result = updateAdminPassword(
    DEFAULT_ADMIN_CREDENTIALS.password,
    'passwordbaru123',
    'passwordtidaksama'
  );
  assert.equal(result.success, false);
  assert.match(result.error || '', /Konfirmasi password baru tidak cocok/i);
});
