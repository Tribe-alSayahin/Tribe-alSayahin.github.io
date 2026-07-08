import type { AuthResult } from '@supabase/server';
import { createAdminClient, createContextClient, verifyAuth } from '@supabase/server/core';
import type { Request as ExpressRequest } from 'express';

const requiredServerEnvKeys = [
  'SUPABASE_URL',
  'SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SECRET_KEY',
  'SUPABASE_JWKS_URL',
] as const;

const getRequestOrigin = (request: ExpressRequest): string => {
  const host = request.get('host') ?? 'localhost:3000';
  const protocol = request.protocol || 'http';
  return `${protocol}://${host}`;
};

const toWebRequest = (request: ExpressRequest): Request => {
  const headers = new Headers();

  for (const [key, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      for (const headerValue of value) {
        headers.append(key, headerValue);
      }
      continue;
    }

    if (typeof value === 'string') {
      headers.set(key, value);
    }
  }

  return new Request(new URL(request.originalUrl || request.url, getRequestOrigin(request)), {
    method: request.method,
    headers,
  });
};

export const isSupabaseServerConfigured = (): boolean =>
  requiredServerEnvKeys.every((key) => !!process.env[key]);

export const getMissingSupabaseServerEnvKeys = (): string[] =>
  requiredServerEnvKeys.filter((key) => !process.env[key]);

export const verifySupabaseUserRequest = async (request: ExpressRequest) =>
  verifyAuth(toWebRequest(request), { auth: 'user' });

export const createSupabaseRequestClient = (auth: AuthResult) =>
  createContextClient({
    auth: {
      token: auth.token,
      keyName: auth.keyName ?? undefined,
    },
  });

export const createSupabaseServiceClient = () => createAdminClient();
