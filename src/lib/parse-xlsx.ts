import type {
  LinkedInData,
  DailyEngagement,
  DailyFollowers,
  TopPost,
  Demographics,
  DemographicEntry,
  OverallStats,
} from "./types";

function parseUSDate(dateStr: string): string {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return dateStr;
  const [month, day, year] = parts;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function getSheet(
  workbook: { Sheets: Record<string, unknown>; SheetNames: string[] },
  name: string
): unknown {
  // Try exact match first, then case-insensitive
  if (workbook.Sheets[name]) return workbook.Sheets[name];
  const lower = name.toLowerCase();
  const found = workbook.SheetNames.find((n) => n.toLowerCase() === lower);
  if (found) return workbook.Sheets[found];
  throw new Error(
    `Missing "${name}" sheet. Make sure you're uploading a LinkedIn Creator Analytics export.`
  );
}

function parseDiscovery(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[][]
): OverallStats {
  return {
    dateRange: String(rows[0]?.[1] || ""),
    totalImpressions: Number(rows[1]?.[1]) || 0,
    membersReached: Number(rows[2]?.[1]) || 0,
  };
}

function parseEngagement(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[][]
): DailyEngagement[] {
  const results: DailyEngagement[] = [];
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0]) continue;
    results.push({
      date: parseUSDate(String(row[0])),
      impressions: Number(row[1]) || 0,
      engagements: Number(row[2]) || 0,
    });
  }
  return results;
}

function parseTopPosts(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[][]
): TopPost[] {
  const postMap = new Map<
    string,
    { url: string; publishDate: string; engagements: number; impressions: number }
  >();

  // Skip info row, empty row, header row — data starts at index 3
  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;

    // Left table: engagements (columns 0, 1, 2)
    const leftUrl = row[0];
    if (leftUrl && typeof leftUrl === "string" && leftUrl.startsWith("http")) {
      const existing = postMap.get(leftUrl) || {
        url: leftUrl,
        publishDate: "",
        engagements: 0,
        impressions: 0,
      };
      existing.publishDate = parseUSDate(String(row[1]));
      existing.engagements = Number(row[2]) || 0;
      postMap.set(leftUrl, existing);
    }

    // Right table: impressions (columns 4, 5, 6)
    const rightUrl = row[4];
    if (rightUrl && typeof rightUrl === "string" && rightUrl.startsWith("http")) {
      const existing = postMap.get(rightUrl) || {
        url: rightUrl,
        publishDate: "",
        engagements: 0,
        impressions: 0,
      };
      if (!existing.publishDate && row[5]) {
        existing.publishDate = parseUSDate(String(row[5]));
      }
      existing.impressions = Number(row[6]) || 0;
      postMap.set(rightUrl, existing);
    }
  }

  return Array.from(postMap.values()).map((p) => ({
    ...p,
    engagementRate: p.impressions > 0 ? p.engagements / p.impressions : 0,
  }));
}

function parseFollowers(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[][]
): { totalFollowers: number; dailyFollowers: DailyFollowers[] } {
  const totalFollowers = Number(rows[0]?.[1]) || 0;
  const dailyFollowers: DailyFollowers[] = [];

  // Skip total row, empty row, header row — data starts at index 3
  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0]) continue;
    dailyFollowers.push({
      date: parseUSDate(String(row[0])),
      newFollowers: Number(row[1]) || 0,
    });
  }

  return { totalFollowers, dailyFollowers };
}

function parseDemographics(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rows: any[][]
): Demographics {
  const result: Demographics = {
    jobTitles: [],
    locations: [],
    industries: [],
    seniority: [],
    companySize: [],
  };

  const categoryMap: Record<string, keyof Demographics> = {
    "Job titles": "jobTitles",
    Locations: "locations",
    Industries: "industries",
    Seniority: "seniority",
    "Company size": "companySize",
  };

  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 3 || !row[1]) continue;

    const cat = String(row[0] || "").trim();
    const key = categoryMap[cat];
    if (key) {
      result[key].push({
        value: String(row[1]),
        percentage: Number(row[2]) || 0,
      });
    }
  }

  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseLinkedInXlsx(XLSX: any, buffer: ArrayBuffer): LinkedInData {
  const workbook = XLSX.read(buffer, { type: "array", cellDates: false });

  const discoveryWs = getSheet(workbook, "DISCOVERY");
  const engagementWs = getSheet(workbook, "ENGAGEMENT");
  const topPostsWs = getSheet(workbook, "TOP POSTS");
  const followersWs = getSheet(workbook, "FOLLOWERS");
  const demographicsWs = getSheet(workbook, "DEMOGRAPHICS");

  const toRows = (ws: unknown) =>
    XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];

  const { totalFollowers, dailyFollowers } = parseFollowers(toRows(followersWs));

  return {
    overall: parseDiscovery(toRows(discoveryWs)),
    dailyEngagement: parseEngagement(toRows(engagementWs)),
    topPosts: parseTopPosts(toRows(topPostsWs)),
    totalFollowers,
    dailyFollowers,
    demographics: parseDemographics(toRows(demographicsWs)),
  };
}
