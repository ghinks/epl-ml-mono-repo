import * as mongodb from "mongodb";
// import { TensorLike3D } from "@tensorflow/tfjs-core/dist/types";
import { MatchData } from "@gvhinks/epl-data-to-db/dist";
// import { Labels } from "./getLabels";
import getLabels from "./getLabels";
import getFeatures from "./getFeatures";
import { url, dbName, collectionName } from "./constants";
import getNames from "./getTeams"

// one hot encoding of the team names means that
// Arsenal would be something like [1,0,0,0,...0]
export interface Features {
  homeTeam: number[];
  awayTeam: number[];
}

export interface Labels {
  homeWin: number;
  awayWin: number;
  draw: number;
}

export interface BaseResult extends Features, Labels {};

const getCollection = (client: mongodb.MongoClient): mongodb.Collection =>
  client.db(dbName).collection(collectionName);

const isHomeWin = (result): number =>
  (result.fullTimeResult === "H")
    ? 1
    : 0;

const isAwayWin = (result): number =>
  (result.fullTimeResult === "A")
    ? 1
    : 0;

const isDraw = (result): number =>
  (result.fullTimeResult === "D")
    ? 1
    : 0;

export interface FlattenedProps {
  labelValues: number[][];
  featureValues: number[][];
}

const flattenResults = (rawData: BaseResult[]): FlattenedProps => {
  const features = getFeatures(rawData);
  const labels = getLabels(rawData);
  const flattenPropsToArray = <T>(o: Features[] | Labels[]): T[][] => o.reduce((a, c): T[] => {
    return [...a, [...Object.values(c)]];
  }, []);
  const labelsArray: number[][]= flattenPropsToArray(labels);
  const featureArray: number[][]= flattenPropsToArray(features);
  return {
    labelValues: labelsArray,
    featureValues: featureArray,
  };
};

const getData = async (team?: string): Promise<BaseResult[]> => {
  try {

    const client: mongodb.MongoClient = await mongodb.MongoClient.connect(url, {
      useNewUrlParser: true
    });
    const teams: Map<string, number[]> = await getNames(client);
    const collection = getCollection(client);
    const query = {
      Date: { $regex: /^20[0-9][0-8].*/ },
      $or: [{ homeTeam: team }, { awayTeam: team }]
    };
    if (!team) delete query["$or"];
    const results: MatchData[] = await collection.find(query).toArray();
    const rawResults = results.map(
      (r): BaseResult => ({
        homeTeam: teams.get(r.homeTeam),
        awayTeam: teams.get(r.awayTeam),
        homeWin: isHomeWin(r),
        awayWin: isAwayWin(r),
        draw: isDraw(r)
      })
    );
    return rawResults;
  } catch (e) {
    console.error(e.message);
    return [];
  }
};

export { getData as default, flattenResults, isHomeWin, isAwayWin, isDraw };
