import { MongoClient } from "mongodb";
import { renameProps } from "../../../epl-data-to-db/src";

const url = "mongodb://localhost:27017";
const dbName = "epl-scores";
const collectionName = "matches";

export interface BaseResult {
  homeTeam: string;
  result: string;
};

const getCollection = client => client.db(dbName).collection(collectionName);

const getData = async (team: string): Promise<BaseResult[]> => {
  try {
    const client: MongoClient = await MongoClient.connect(url, {
      useNewUrlParser: true
    });
    const collection = getCollection(client);
    const results = await collection.find({homeTeam: team}).toArray();
    return results.map(r => ({
      homeTeam: r.homeTeam,
      result: r.fullTimeResult
    }));
  } catch (e) {
    console.error(e.message);
    return [];
  }
};

export default getData;
