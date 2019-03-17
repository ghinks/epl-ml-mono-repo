import { MongoClient, Db } from "mongodb";
import assert from "assert";
import {MatchResult} from "@gvhinks/epl-data-reader";

const url = 'mongodb://localhost:27017';
const dbName = 'epl-scores';
const writeToDB = async (games: MatchResult[]): Promise<boolean> => {
  try {
    const client: MongoClient = await MongoClient.connect(url, { useNewUrlParser: true });
    console.info("connected...");
    const matches = await client.db(dbName).createCollection("matches");
    console.log(matches);
    await matches.insertMany(games);
    client.close();
    console.info("closed matches");
    return true;

  } catch (e) {
    console.error(e.message);
    return false;
  }
}

export default writeToDB;
