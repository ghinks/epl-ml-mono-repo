import { MongoClient, Db } from "mongodb";
import assert from "assert";
import {MatchResult} from "@gvhinks/epl-data-reader";

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'epl-scores';
//
const writeToDB = async (games: MatchResult[]): Promise<boolean> => {
  try {
    const client: MongoClient = await MongoClient.connect(url, { useNewUrlParser: true });
    console.info("connected...");
    const matches = await client.db("epl").createCollection("matches");
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
