import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const dbName = "epl-scores";
const collectionName = "matches";

export interface BaseResult {
  team: string;
  win: boolean;
  draw: boolean;
  loose: boolean;
};

const getCollection = client => client.db(dbName).collection(collectionName);

const isWin = (result, team) =>
  (result.homeTeam === team ) && result.fullTimeResult === "H" ||
  (result.awayTeam === team ) && result.fullTimeResult === "A" ? true : false;

const getData = async (team: string): Promise<BaseResult[]> => {
  try {
    const client: MongoClient = await MongoClient.connect(url, {
      useNewUrlParser: true
    });
    const collection = getCollection(client);
    const results = await collection.find({$or: [ {homeTeam: team}, {awayTeam: team} ]}).toArray();
    return results.map(r => ({
      team: team,
      win: isWin(r, team),
      loose: !isWin(r, team),
      draw: r.fullTimeResult === "D" ? true : false
    }));
  } catch (e) {
    console.error(e.message);
    return [];
  }
};

export default getData;
