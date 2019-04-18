import * as mongodb from "mongodb";

const url = "mongodb://localhost:27017";
const dbName = "epl-scores";
const collectionName = "matches";

export interface BaseResult {
  // team: string;
  win: boolean;
  draw: boolean;
  loose: boolean;
};

const getCollection = (client: mongodb.MongoClient): mongodb.Collection => client.db(dbName).collection(collectionName);

const isWin = (result, team): boolean =>
  (result.homeTeam === team ) && result.fullTimeResult === "H" ||
  (result.awayTeam === team ) && result.fullTimeResult === "A" ? true : false;

const getData = async (team: string): Promise<BaseResult[]> => {
  try {
    const client: mongodb.MongoClient = await mongodb.MongoClient.connect(url, {
      useNewUrlParser: true
    });
    const collection = getCollection(client);
    const results = await collection.find({
      Date: { $regex: /^20[0-9][0-8].*/ },
      $or: [ {homeTeam: team}, {awayTeam: team} ]
    }).toArray();
    const answer = results.map((r): BaseResult => ({
      // team: team,
      win: isWin(r, team),
      loose: !isWin(r, team),
      draw: r.fullTimeResult === "D" ? true : false
    }));
    return answer;
  } catch (e) {
    console.error(e.message);
    return [];
  }
};

export default getData;
