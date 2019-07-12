import { Forecast, Fixture } from "@gvhinks/epl-common-interfaces";
import * as mongodb from "mongodb";
import { url, dbName, historicalMatches } from "@gvhinks/epl-constants";

const getFixtures = async (): Promise<Fixture[]> => {
  try {
    const client: mongodb.MongoClient = await mongodb.MongoClient.connect(url, {
      useNewUrlParser: true
    });
    const getCollection = (client: mongodb.MongoClient): mongodb.Collection =>
      client.db(dbName).collection(historicalMatches);
    const collection = getCollection(client);
    const results: Fixture[] = await collection.find({}).toArray();
    return results;
  } catch (e) {
    console.error(e.message);
    return [];
  }

};

export { getFixtures }
