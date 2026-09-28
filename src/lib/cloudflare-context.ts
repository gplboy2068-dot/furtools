export interface CloudflareEnv {
  DB?: any;
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
  }
}

export function getWorkerEnv(): CloudflareEnv | null {
  return _workerEnv || (globalThis as any).__CF_ENV__ || null;
}

export function getD1(): any | null {
  const env = getWorkerEnv();
  return env?.DB || (globalThis as any).__D1_DB__ || null;
}
