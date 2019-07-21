import { FixturePrediction } from "@gvhinks/epl-common-interfaces";

const testSet1: FixturePrediction[] = [
  {
    roundNumber: 1,
    date: new Date(),
    location: "placeA",
    homeTeam: "teamA",
    awayTeam: "teamB",
    standardizedResult: [1, 0, 0]
  },
  {
    roundNumber: 1,
    date: new Date(),
    location: "placeC",
    homeTeam: "teamC",
    awayTeam: "teamD",
    standardizedResult: [0, 1, 0]
  },
  {
    roundNumber: 1,
    date: new Date(),
    location: "placeE",
    homeTeam: "teamE",
    awayTeam: "teamF",
    standardizedResult: [0, 0, 1]
  }
];


const testHomeAwayWin: FixturePrediction[] = [
  {
    roundNumber: 1,
    date: new Date(),
    location: "placeA",
    homeTeam: "teamA",
    awayTeam: "teamB",
    standardizedResult: [1, 0, 0]
  },
  {
    roundNumber: 1,
    date: new Date(),
    location: "placeB",
    homeTeam: "teamB",
    awayTeam: "teamA",
    standardizedResult: [0, 1, 0]
  }
];

interface TestFixPred {
  teamA: string;
  teamB: string;
  result: number[];
}

const createFixPred = (testData: TestFixPred[]): FixturePrediction[] => {
  return testData.map((t: TestFixPred): FixturePrediction => {
    return {
      roundNumber: 1,
      date: new Date(),
      location: "",
      homeTeam: t.teamA,
      awayTeam: t.teamB,
      standardizedResult: t.result
    }
  });
};
export { testSet1, testHomeAwayWin, TestFixPred, createFixPred }
