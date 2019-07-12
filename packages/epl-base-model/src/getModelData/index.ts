import * as mongodb from "mongodb";
import { MatchData } from "@gvhinks/epl-data-to-db";
import flattenLabels, { Labels } from "./getLabels";
import flattenFeatures, { Features } from "./getFeatures";
import { url, dbName, historicalMatches } from "@gvhinks/epl-constants";
import getNames from "./getTeams"

// export interface BaseResult extends Features, Labels {};
export interface TrainingData {
  labelValues: number[][];
  featureValues: number[][][];
}

const getCollection = (client: mongodb.MongoClient): mongodb.Collection =>
  client.db(dbName).collection(historicalMatches);

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

const getTrainingData = async (fromDate: Date = new Date(2000, 1,1), toDate: Date = new Date(2018, 1, 1)): Promise<TrainingData> => {
  try {
    const client: mongodb.MongoClient = await mongodb.MongoClient.connect(url, {
      useNewUrlParser: true
    });
    const teams: Map<string, number[]> = await getNames();
    const collection = getCollection(client);
    const query = {
      Date: { $gte: fromDate, $lte: toDate },
    };
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

export { getTrainingData as default, flattenLabels, flattenFeatures, isHomeWin, isAwayWin, isDraw, getNames };
