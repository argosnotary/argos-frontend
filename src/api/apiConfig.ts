import { Configuration } from "./configuration";

export function getApiConfigUnauthenticated() {
  return new Configuration({ basePath: "/api" });
}

export function getApiConfig(token: string) {
  return new Configuration({ basePath: "/api", accessToken: token });
}
