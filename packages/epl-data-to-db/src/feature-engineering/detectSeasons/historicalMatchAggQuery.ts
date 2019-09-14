import { MongoClient } from "mongodb";
import { historicalMatches } from "@gvhinks/epl-constants";

const historicalMatchAggQuery = (client: MongoClient, dbName: string, query: object[]): any => {
  return client.db(dbName).collection(historicalMatches).aggregate(query).toArray();
}

export default  historicalMatchAggQuery;
