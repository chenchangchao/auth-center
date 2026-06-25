// src/lib/server-proxy.ts
import { ProxyAgent, setGlobalDispatcher } from "undici";

const proxyUrl =
  process.env.HTTPS_PROXY ||
  process.env.HTTP_PROXY ||
  process.env.ALL_PROXY;

if (process.env.NODE_ENV !== "production" && proxyUrl) {
  console.log("[server-proxy] Using proxy:", proxyUrl);
  setGlobalDispatcher(new ProxyAgent(proxyUrl));
}