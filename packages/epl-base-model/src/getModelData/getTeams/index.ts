import * as mongodb from "mongodb";
import { dbName, collectionName } from "../constants";

const getCollection = (client: mongodb.MongoClient): mongodb.Collection =>
  client.db(dbName).collection(collectionName);

const getNames = async (client: mongodb.MongoClient): Promise<Map<string, number[]>> => {
  const collection = getCollection(client);
  // @ts-ignore
  const names: string[] = (await collection.distinct("homeTeam")).sort();
  const map = new Map();
  Object.keys(names).forEach((k): void => {
    // create an array of n names defaulted to zero
    // then set this name to 1 in the Kth position
    const oneHot: number[] = Array(names.length).fill(0);
    oneHot[k] = 1;
    map.set(names[k], oneHot);
    //  console.log(`${names[k]} = ${oneHot}`)
  });
  // console.log(map);
  return map;
};

export  { getNames as default, getCollection };

