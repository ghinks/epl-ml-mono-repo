import * as mongodb from "mongodb";
import { TensorLike3D } from "@tensorflow/tfjs-core/dist/types";
import { MatchData } from "@gvhinks/epl-data-to-db/dist";

const url = "mongodb://localhost:27017";
const dbName = "epl-scores";
const collectionName = "matches";

export interface BaseResult {
  opponents: string; // the other team
  win: number;
  draw: number;
  loose: number;
};

const getCollection = (client: mongodb.MongoClient): mongodb.Collection => client.db(dbName).collection(collectionName);

const isWin = (result, team: string): number =>
  (result.homeTeam === team ) && result.fullTimeResult === "H" ||
  (result.awayTeam === team ) && result.fullTimeResult === "A" ? 1 : 0;

const getOpponents = (team: string, result): string => {
  return "";
};

export interface FlattenedProps {
  values: number[];
  tensorCount: number;
};

const flattenResultProps = (rawData: BaseResult[]): FlattenedProps => {
  const values: number[] = rawData.reduce((a,c): number[] => {
    return [...a, ...Object.values(c)];
  }, [])
  return {
    values,
    tensorCount: rawData.length
  };
};

const getTrainingData = async (team: string): Promise<BaseResult[]> => {
  try {
    const client: mongodb.MongoClient = await mongodb.MongoClient.connect(url, {
      useNewUrlParser: true
    });
    const collection = getCollection(client);
    const results: MatchData[] = await collection.find({
      Date: { $regex: /^20[0-9][0-8].*/ },
      $or: [ {homeTeam: team}, {awayTeam: team} ]
    }).toArray();
    const rawResults = results.map((r): BaseResult => ({
      opponents: team,
      win: isWin(r, team),
      loose: isWin(r, team) === 1 ? 0 : 1,
      draw: r.fullTimeResult === "D" ? 1 : 0
    }));
    return rawResults;
  } catch (e) {
    console.error(e.message);
    return [];
  }
};

export { getTrainingData as default, flattenResultProps, isWin };
