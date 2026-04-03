import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Trigger data refresh by calling our API route
    const baseUrl =
      process.env.VERCEL_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const protocol = baseUrl.includes("localhost") ? "http" : "https";
    const url = `${protocol}://${baseUrl}/api/linkedin-data`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      dataFetchedAt: data.fetchedAt,
    });
  } catch (error) {
    console.error("Cron job failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
