import { NextResponse } from "next/server";

const CACHE_DURATION = 24 * 60 * 60; // 24 hours in seconds

interface LinkedInSnapshot {
  fetchedAt: string;
  source: string;
  profile?: unknown;
  posts?: unknown;
  analytics?: unknown[];
}

async function fetchLinkedInData(): Promise<LinkedInSnapshot> {
  const {
    LINKEDIN_ACCESS_TOKEN,
    LINKEDIN_REFRESH_TOKEN,
    LINKEDIN_CLIENT_ID,
    LINKEDIN_CLIENT_SECRET,
  } = process.env;

  if (!LINKEDIN_ACCESS_TOKEN && !LINKEDIN_REFRESH_TOKEN) {
    throw new Error("No LinkedIn credentials configured");
  }

  let accessToken = LINKEDIN_ACCESS_TOKEN;

  // Refresh token if available
  if (LINKEDIN_REFRESH_TOKEN && LINKEDIN_CLIENT_ID && LINKEDIN_CLIENT_SECRET) {
    try {
      const tokenResponse = await fetch(
        "https://www.linkedin.com/oauth/v2/accessToken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: LINKEDIN_REFRESH_TOKEN,
            client_id: LINKEDIN_CLIENT_ID,
            client_secret: LINKEDIN_CLIENT_SECRET,
          }),
        }
      );

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        accessToken = tokenData.access_token;
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
  }

  if (!accessToken) {
    throw new Error("No valid access token available");
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "X-Restli-Protocol-Version": "2.0.0",
  };

  // Fetch profile
  const profileResponse = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers,
  });

  if (!profileResponse.ok) {
    throw new Error(`Failed to fetch profile: ${profileResponse.status}`);
  }

  const profile = await profileResponse.json();
  const memberUrn = profile.sub ? `urn:li:person:${profile.sub}` : null;

  // Fetch posts
  let posts = null;
  if (memberUrn) {
    const params = new URLSearchParams({
      q: "authors",
      authors: `List(${memberUrn})`,
      count: "100",
    });

    const postsResponse = await fetch(
      `https://api.linkedin.com/v2/ugcPosts?${params.toString()}`,
      { headers }
    );

    if (postsResponse.ok) {
      posts = await postsResponse.json();
    }
  }

  return {
    fetchedAt: new Date().toISOString(),
    source: "linkedin-api",
    profile,
    posts,
    analytics: [],
  };
}

export async function GET() {
  try {
    const data = await fetchLinkedInData();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
      },
    });
  } catch (error) {
    console.error("Failed to fetch LinkedIn data:", error);

    // Return error response but don't crash
    return NextResponse.json(
      {
        error: "Failed to fetch LinkedIn data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
