/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    user?: import('./lib/auth').SessionUser;
  }
}

interface ImportMetaEnv {
  readonly GITHUB_CLIENT_ID: string;
  readonly GITHUB_CLIENT_SECRET: string;
  readonly SESSION_SECRET: string;
  readonly ALLOWED_GITHUB_USERS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
