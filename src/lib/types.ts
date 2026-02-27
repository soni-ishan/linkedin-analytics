export interface DailyEngagement {
  date: string; // YYYY-MM-DD
  impressions: number;
  engagements: number;
}

export interface DailyFollowers {
  date: string; // YYYY-MM-DD
  newFollowers: number;
}

export interface TopPost {
  url: string;
  publishDate: string; // YYYY-MM-DD
  impressions: number;
  engagements: number;
  engagementRate: number;
}

export interface DemographicEntry {
  value: string;
  percentage: number;
}

export interface Demographics {
  jobTitles: DemographicEntry[];
  locations: DemographicEntry[];
  industries: DemographicEntry[];
  seniority: DemographicEntry[];
  companySize: DemographicEntry[];
}

export interface OverallStats {
  dateRange: string;
  totalImpressions: number;
  membersReached: number;
}

export interface LinkedInData {
  overall: OverallStats;
  dailyEngagement: DailyEngagement[];
  topPosts: TopPost[];
  totalFollowers: number;
  dailyFollowers: DailyFollowers[];
  demographics: Demographics;
}

export interface TopDay {
  date: string;
  value: number;
  label: string;
}

export interface ComputedStats {
  totalImpressions: number;
  membersReached: number;
  totalFollowers: number;
  totalEngagements: number;
  medianPostImpressions: number;
  medianPostEngagements: number;
  avgPostImpressions: number;
  avgPostEngagements: number;
  medianEngagementRate: number;
  avgDailyImpressions: number;
  followerGrowthRate: number;
  cumulativeFollowers: Array<{ date: string; followers: number }>;
  cumulativeEngagement: Array<{
    date: string;
    impressions: number;
    engagements: number;
  }>;
  dailyNewFollowers: Array<{ date: string; followers: number }>;
  postsPerWeek: number;
  bestDayOfWeek: string;
  topDays: {
    impressions: TopDay[];
    followers: TopDay[];
  };
  dayOfWeekBreakdown: Array<{
    day: string;
    avgImpressions: number;
    avgEngagements: number;
    avgNewFollowers: number;
  }>;
}

export type DateRange = "week" | "month" | "3months" | "year";
