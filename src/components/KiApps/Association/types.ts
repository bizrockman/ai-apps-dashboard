export interface MarketResearchFormData {
  industry: string;
  customIndustry?: string;
  region: string;
  customRegion?: string;
}

export interface MarketResearchOptions {
  industries: string[];
  regions: string[];
}