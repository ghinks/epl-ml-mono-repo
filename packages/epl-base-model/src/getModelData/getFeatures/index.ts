import { BaseResult, Features } from "../index";

export default (baseResults: BaseResult[]): Features[] => {
  const features: Features[] = baseResults.map((r: BaseResult): Features => ({
    homeTeam: r.homeTeam,
    awayTeam: r.awayTeam
  }));
  return features;
};
