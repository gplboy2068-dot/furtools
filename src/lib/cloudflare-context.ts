export interface CloudflareEnv {
  DB?: any;
  STORAGE?: any;
  ASSETS?: any;
  [key: string]: any;
}

let _workerEnv: CloudflareEnv | null = null;

export function setWorkerEnv(env: unknown) {
  if (env && typeof env === "object") {
    _workerEnv = env as CloudflareEnv;
    (globalThis as any).__CF_ENV__ = env;
    if ((env as CloudflareEnv).DB) {
      (globalThis as any).__D1_DB__ = (env as CloudflareEnv).DB;
    }
    if ((env as CloudflareEnv).STORAGE) {
      (globalThis as any).__R2_STORAGE__ = (env as CloudflareEnv).STORAGE;
    }
  }
}

export function getWorkerEnv(): CloudflareEnv | null {
  return (
    _workerEnv ||
    (globalThis as any).__CF_ENV__ ||
    (globalThis as any).__env__ ||
    (typeof process !== "undefined" && (process as any).env) ||
    null
  );
}

export function getD1(): any | null {
  const env = getWorkerEnv();
  return (
    env?.DB ||
    (globalThis as any).__D1_DB__ ||
    (globalThis as any).__env__?.DB ||
    (typeof process !== "undefined" && (process as any).env?.DB) ||
    null
  );
}

export function getR2(): any | null {
  const env = getWorkerEnv();
  return (
    env?.STORAGE ||
    (globalThis as any).__R2_STORAGE__ ||
    (globalThis as any).__env__?.STORAGE ||
    (typeof process !== "undefined" && (process as any).env?.STORAGE) ||
    null
  );
}
