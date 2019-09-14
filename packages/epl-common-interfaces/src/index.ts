/*
    This is the standardized data result that is extracted from multiple data
    sets.
 */
interface StandardResult {
  Date: Date;
  HomeTeam: string;
  AwayTeam: string;
  Referee: string;
  FTR: string;
};

interface Forecast {
  position: number;
  team: string;
  wins: number;
  loses: number;
  draws: number;
  points: number;
};

interface Fixture {
  roundNumber: number;
  date: Date;
  location: string;
  homeTeam: string;
  awayTeam: string;
};

interface FixturePrediction extends Fixture {
  standardizedResult: number[];
}

// result so that console op is ok to view
interface PredictResult {
  homeTeam: string;
  awayTeam: string;
  standardizedResult: number[];
  actualResult: number[];
  comparison: boolean;
  result: number[];
};

export { Forecast, Fixture, PredictResult, FixturePrediction, StandardResult };
