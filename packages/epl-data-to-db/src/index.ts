import { MongoClient } from "mongodb";
import { StandardResult, FutureGame } from "@gvhinks/epl-data-reader";

export interface MatchData {
  Date: Date;
  homeTeam: string;
  awayTeam: string;
  referee: string;
  fullTimeResult: string;
}

const renameHistoricalProps = (games: StandardResult[]): MatchData[] => {
  return games.map(
    (g): MatchData => ({
      Date: g.Date,
      awayTeam: g.AwayTeam,
      fullTimeResult: g.FTR,
      homeTeam: g.HomeTeam,
      referee: g.Referee
    })
  );
};

const writeHistoricalData = async (games: StandardResult[]): Promise<boolean> => {
  const url = "mongodb://localhost:27017";
  const dbName = "epl-scores";
  const collectionName = "matches";
  try {
    const client: MongoClient = await MongoClient.connect(url, {
      useNewUrlParser: true
    });
    const db = await client.db(dbName);
    if(db.length) await db.dropCollection(collectionName);
    const matches = await client.db(dbName).createCollection(collectionName);
    await matches.insertMany(renameHistoricalProps(games));
    client.close();
    return true;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};

const writeFutureFixtures = async (fixtures: FutureGame[]): Promise<boolean> => {
  const url = "mongodb://localhost:27017";
  const dbName = "epl-scores";
  const collectionName = "fixtures";
  try {
    const client: MongoClient = await MongoClient.connect(url, {
      useNewUrlParser: true
    });
    const db = await client.db(dbName);
    if(db.length) await db.dropCollection(collectionName);
    const futureMatches = await client.db(dbName).createCollection(collectionName);
    await futureMatches.insertMany(fixtures);
    client.close();
    return true;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
export { writeHistoricalData as default, renameHistoricalProps, writeFutureFixtures };
