import { BaseResult, Labels} from "../index";

export default (baseResults: BaseResult[]): Labels[] => {
  const labels: Labels[] = baseResults.map((r: BaseResult): Labels => ({
    homeWin: r.homeWin,
    awayWin: r.awayWin,
    draw: r.draw
  }));
  return labels;
};
