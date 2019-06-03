import { MongoClient } from "mongodb";
import { MatchResult } from "@gvhinks/epl-data-reader";

const url = "mongodb://localhost:27017";
const dbName = "epl-scores";
const collectionName = "matches";

export interface MatchData {
  awayTeamCorners: number;
  awayTeamFouls: number;
  awayTeamReds: number;
  awayTeamShots: number;
  awayTeamShotsOnTarget: number;
  awayTeamYellowCards: number;
  awayTeam: string;
  Date: string;
  fullTimeAwayGoals: number;
  fullTimeHomeGoals: number;
  fullTimeResult: string;
  homeTeamCorners: number;
  homeTeamFouls: number;
  homeTeamRedCards: number;
  homeTeamShots: number;
  homeTeamShotsOnTarget: number;
  halfTimeAwayTeamGoals: number;
  halfTimeHomeTeamGoals: number;
  halfTimeResult: string;
  homeTeamYellowCards: number;
  homeTeam: string;
  referee: string;
}

const renameProps = (games: MatchResult[]): MatchData[] => {
  return games.map(
    (g): MatchData => ({
      awayTeamCorners: Number(g.AC),
      awayTeamFouls: Number(g.AF),
      awayTeamReds: Number(g.AR),
      awayTeamShots: Number(g.AS),
      awayTeamShotsOnTarget: Number(g.AST),
      awayTeamYellowCards: Number(g.AY),
      awayTeam: g.AwayTeam,
      Date: g.Date,
      fullTimeAwayGoals: Number(g.FTAG),
      fullTimeHomeGoals: Number(g.FTHG),
      fullTimeResult: g.FTR,
      homeTeamCorners: Number(g.HC),
      homeTeamFouls: Number(g.HF),
      homeTeamRedCards: Number(g.HR),
      homeTeamShots: Number(g.HS),
      homeTeamShotsOnTarget: Number(g.HST),
      halfTimeAwayTeamGoals: Number(g.HTAG),
      halfTimeHomeTeamGoals: Number(g.HTHG),
      halfTimeResult: g.HTR,
      homeTeamYellowCards: Number(g.HY),
      homeTeam: g.HomeTeam,
      referee: g.Referee
    })
  );
};

const writeToDB = async (games: MatchResult[]): Promise<boolean> => {
  try {
    const client: MongoClient = await MongoClient.connect(url, {
      useNewUrlParser: true
    });
    await client.db(dbName).dropCollection(collectionName);
    const matches = await client.db(dbName).createCollection(collectionName);
    await matches.insertMany(renameProps(games));
    client.close();
    return true;
  } catch (e) {
    return false;
  }
};
export { writeToDB as default, renameProps };
