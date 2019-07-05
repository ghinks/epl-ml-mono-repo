import { MongoClient } from "mongodb";
import { StandardResult } from "@gvhinks/epl-data-reader";

const url = "mongodb://localhost:27017";
const dbName = "epl-scores";
const collectionName = "matches";

export interface MatchData {
  Date: Date;
  homeTeam: string;
  awayTeam: string;
  referee: string;
  fullTimeResult: string;
}

const renameProps = (games: StandardResult[]): MatchData[] => {
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

const writeToDB = async (games: StandardResult[]): Promise<boolean> => {
  try {
    const client: MongoClient = await MongoClient.connect(url, {
      useNewUrlParser: true
    });
    const db = await client.db(dbName);
    if(db.length) await db.dropCollection(collectionName);
    const matches = await client.db(dbName).createCollection(collectionName);
    await matches.insertMany(renameProps(games));
    client.close();
    return true;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
export { writeToDB as default, renameProps };
