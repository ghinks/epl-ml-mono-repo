import { MongoClient } from "mongodb";
import { StandardResult } from "@gvhinks/epl-data-reader";
import { Fixture } from "@gvhinks/epl-common-interfaces";
import { url, dbName, historicalMatches, fixtures as fixturesCollection } from "@gvhinks/epl-constants";

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
  try {
    const client: MongoClient = await MongoClient.connect(url, {
      useNewUrlParser: true
    });
    const db = await client.db(dbName);
    if(db.length) await db.dropCollection(historicalMatches);
    const matches = await client.db(dbName).createCollection(historicalMatches);
    await matches.insertMany(renameHistoricalProps(games));
    client.close();
    return true;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};

const writeFutureFixtures = async (fixtures: Fixture[]): Promise<boolean> => {
  try {
    const client: MongoClient = await MongoClient.connect(url, {
      useNewUrlParser: true
    });
    const db = await client.db(dbName);
    if(db.length) await db.dropCollection(fixturesCollection);
    const futureMatches = await client.db(dbName).createCollection(fixturesCollection);
    await futureMatches.insertMany(fixtures);
    client.close();
    return true;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
export { writeHistoricalData as default, renameHistoricalProps, writeFutureFixtures };
