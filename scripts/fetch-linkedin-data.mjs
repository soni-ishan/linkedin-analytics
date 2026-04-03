import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_OUTPUT_FILE = path.join(
  ROOT_DIR,
  "src",
  "data",
  "live-linkedin-snapshot.json"
);

const {
  LINKEDIN_ACCESS_TOKEN,
  LINKEDIN_REFRESH_TOKEN,
  LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET,
  LINKEDIN_OUTPUT_FILE = DEFAULT_OUTPUT_FILE,
  LINKEDIN_ANALYTICS_ENDPOINTS = "",
} = process.env;

const RESOLVED_OUTPUT_FILE = path.isAbsolute(LINKEDIN_OUTPUT_FILE)
  ? LINKEDIN_OUTPUT_FILE
  : path.resolve(ROOT_DIR, LINKEDIN_OUTPUT_FILE);

function requireValue(value, name) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function buildHeaders(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "X-Restli-Protocol-Version": "2.0.0",
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof body === "string"
        ? body
        : body?.message || body?.error_description || JSON.stringify(body);
    throw new Error(`Request failed for ${url}: ${response.status} ${message}`);
  }

  return body;
}

async function refreshAccessToken() {
  if (!LINKEDIN_REFRESH_TOKEN) {
    return requireValue(LINKEDIN_ACCESS_TOKEN, "LINKEDIN_ACCESS_TOKEN");
  }

  const clientId = requireValue(LINKEDIN_CLIENT_ID, "LINKEDIN_CLIENT_ID");
  const clientSecret = requireValue(
    LINKEDIN_CLIENT_SECRET,
    "LINKEDIN_CLIENT_SECRET"
  );

  const tokenResponse = await fetchJson(
    "https://www.linkedin.com/oauth/v2/accessToken",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: LINKEDIN_REFRESH_TOKEN,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    }
  );

  if (!tokenResponse.access_token) {
    throw new Error("LinkedIn did not return a refreshed access token.");
  }

  return tokenResponse.access_token;
}

async function fetchProfile(accessToken) {
  return fetchJson("https://api.linkedin.com/v2/userinfo", {
    headers: buildHeaders(accessToken),
  });
}

async function fetchCreatorPosts(accessToken, memberUrn) {
  const params = new URLSearchParams({
    q: "authors",
    authors: `List(${memberUrn})`,
    count: "100",
  });

  return fetchJson(`https://api.linkedin.com/v2/ugcPosts?${params.toString()}`, {
    headers: buildHeaders(accessToken),
  });
}

async function fetchAdditionalEndpoints(accessToken, endpoints) {
  if (endpoints.length === 0) {
    return [];
  }

  const results = [];
  for (const endpoint of endpoints) {
    const trimmed = endpoint.trim();
    if (!trimmed) continue;
    const url = trimmed.startsWith("http")
      ? trimmed
      : `https://api.linkedin.com${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
    const response = await fetchJson(url, { headers: buildHeaders(accessToken) });
    results.push({ url, response });
  }

  return results;
}

async function main() {
  const accessToken = await refreshAccessToken();
  const profile = await fetchProfile(accessToken);
  const memberUrn = profile.sub ? `urn:li:person:${profile.sub}` : null;

  const posts = memberUrn ? await fetchCreatorPosts(accessToken, memberUrn) : null;
  const additionalEndpoints = LINKEDIN_ANALYTICS_ENDPOINTS
    ? LINKEDIN_ANALYTICS_ENDPOINTS.split("|")
    : [];
  const analytics = await fetchAdditionalEndpoints(accessToken, additionalEndpoints);

  const snapshot = {
    fetchedAt: new Date().toISOString(),
    source: "linkedin-api",
    profile,
    posts,
    analytics,
  };

  await mkdir(path.dirname(RESOLVED_OUTPUT_FILE), { recursive: true });
  await writeFile(
    RESOLVED_OUTPUT_FILE,
    `${JSON.stringify(snapshot, null, 2)}\n`
  );

  console.log(
    `Saved LinkedIn snapshot to ${path.relative(ROOT_DIR, RESOLVED_OUTPUT_FILE)}`
  );
  console.log(`Fetched profile ${profile?.name || profile?.localizedFirstName || "unknown"}`);
  console.log(`Fetched ${posts?.elements?.length ?? 0} posts`);
  console.log(`Fetched ${analytics.length} additional analytics endpoint(s)`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});