import type { LinkedInData, ComputedStats, TopDay } from "./types";

function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function computeStats(data: LinkedInData): ComputedStats {
  const totalEngagements = data.dailyEngagement.reduce(
    (s, d) => s + d.engagements,
    0
  );
  const totalImpressionsDays = data.dailyEngagement.reduce(
    (s, d) => s + d.impressions,
    0
  );

  const postImpressions = data.topPosts
    .map((p) => p.impressions)
    .filter((n) => n > 0);
  const postEngagements = data.topPosts
    .map((p) => p.engagements)
    .filter((n) => n > 0);
  const postEngRates = data.topPosts
    .map((p) => p.engagementRate)
    .filter((n) => n > 0);

  // Build cumulative followers
  const sortedFollowers = [...data.dailyFollowers].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  const totalNewFollowers = sortedFollowers.reduce(
    (s, d) => s + d.newFollowers,
    0
  );
  const startFollowers = data.totalFollowers - totalNewFollowers;

  let cumulative = startFollowers;
  const cumulativeFollowers = sortedFollowers.map((d) => {
    cumulative += d.newFollowers;
    return { date: d.date, followers: cumulative };
  });

  // Build cumulative engagement
  const sortedEngagement = [...data.dailyEngagement].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  let cumImpressions = 0;
  let cumEngagements = 0;
  const cumulativeEngagement = sortedEngagement.map((d) => {
    cumImpressions += d.impressions;
    cumEngagements += d.engagements;
    return {
      date: d.date,
      impressions: cumImpressions,
      engagements: cumEngagements,
    };
  });

  // Build daily new followers array (remapped for chart consistency)
  const dailyNewFollowers = sortedFollowers.map((d) => ({
    date: d.date,
    followers: d.newFollowers,
  }));

  const dayCount = data.dailyEngagement.length || 1;

  // Posts per week
  const weekSpan = dayCount / 7;
  const postsPerWeek =
    weekSpan > 0 ? data.topPosts.length / weekSpan : data.topPosts.length;

  // Day-of-week breakdown
  const dowStats = new Map<
    number,
    {
      impressionSum: number;
      engagementSum: number;
      followerSum: number;
      count: number;
    }
  >();
  for (const d of data.dailyEngagement) {
    const dow = new Date(d.date + "T00:00:00").getDay();
    const existing = dowStats.get(dow) || {
      impressionSum: 0,
      engagementSum: 0,
      followerSum: 0,
      count: 0,
    };
    existing.impressionSum += d.impressions;
    existing.engagementSum += d.engagements;
    existing.count += 1;
    dowStats.set(dow, existing);
  }
  for (const d of data.dailyFollowers) {
    const dow = new Date(d.date + "T00:00:00").getDay();
    const existing = dowStats.get(dow);
    if (existing) {
      existing.followerSum += d.newFollowers;
    }
  }

  // Best day of week (by avg impressions)
  let bestDow = 0;
  let bestAvg = 0;
  for (const [dow, { impressionSum, count }] of dowStats) {
    const avg = impressionSum / count;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestDow = dow;
    }
  }

  // Build ordered Sun–Sat breakdown
  const DOW_ORDER = [0, 1, 2, 3, 4, 5, 6]; // Sun first
  const dayOfWeekBreakdown = DOW_ORDER.map((dow) => {
    const stats = dowStats.get(dow);
    const count = stats?.count || 1;
    return {
      day: DAY_NAMES[dow],
      avgImpressions: Math.round((stats?.impressionSum || 0) / count),
      avgEngagements: Math.round((stats?.engagementSum || 0) / count),
      avgNewFollowers: Math.round((stats?.followerSum || 0) / count),
    };
  });

  // Top 3 days for impressions
  const topImpressionDays: TopDay[] = [...data.dailyEngagement]
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 3)
    .map((d) => ({
      date: d.date,
      value: d.impressions,
      label: "impressions",
    }));

  // Top 3 days for follower growth
  const topFollowerDays: TopDay[] = [...data.dailyFollowers]
    .sort((a, b) => b.newFollowers - a.newFollowers)
    .slice(0, 3)
    .map((d) => ({
      date: d.date,
      value: d.newFollowers,
      label: "new followers",
    }));

  return {
    totalImpressions: data.overall.totalImpressions,
    membersReached: data.overall.membersReached,
    totalFollowers: data.totalFollowers,
    totalEngagements,
    medianPostImpressions: median(postImpressions),
    medianPostEngagements: median(postEngagements),
    avgPostImpressions: Math.round(
      postImpressions.reduce((s, n) => s + n, 0) / (postImpressions.length || 1)
    ),
    avgPostEngagements: Math.round(
      postEngagements.reduce((s, n) => s + n, 0) / (postEngagements.length || 1)
    ),
    medianEngagementRate: median(postEngRates),
    avgDailyImpressions: Math.round(totalImpressionsDays / dayCount),
    followerGrowthRate: totalNewFollowers / dayCount,
    cumulativeFollowers,
    cumulativeEngagement,
    dailyNewFollowers,
    postsPerWeek,
    bestDayOfWeek: DAY_NAMES[bestDow],
    topDays: {
      impressions: topImpressionDays,
      followers: topFollowerDays,
    },
    dayOfWeekBreakdown,
  };
}
