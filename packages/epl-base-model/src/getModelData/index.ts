import * as mongodb from "mongodb";
import { MatchData } from "@gvhinks/epl-data-to-db/dist";
import flattenLabels, { Labels } from "./getLabels";
import flattenFeatures, { Features } from "./getFeatures";
import { url, dbName, collectionName } from "./constants";
import getNames from "./getTeams"

// export interface BaseResult extends Features, Labels {};
export interface TrainingData {
  labelValues: number[][];
  featureValues: number[][][];
}

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

const getTrainingData = async (team?: string): Promise<TrainingData> => {
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

    const rawLabels: Labels[] = results.map(
      (r): Labels => ({
        homeWin: isHomeWin(r),
        awayWin: isAwayWin(r),
        draw: isDraw(r)
      })
    );

    const labelValues: number[][] = flattenLabels(rawLabels);

    const rawFeatures: Features[] = results.map(
      (r): Features => ({
        homeTeam: teams.get(r.homeTeam),
        awayTeam: teams.get(r.awayTeam)
      })
    );

    const featureValues: number[][][] = flattenFeatures(rawFeatures);
    return {
      labelValues,
      featureValues,
    }
  } catch (e) {
    console.error(e.message);
    return {
      labelValues: [],
      featureValues: []
    }
  }
};

export { getTrainingData as default, flattenLabels, flattenFeatures, isHomeWin, isAwayWin, isDraw };
