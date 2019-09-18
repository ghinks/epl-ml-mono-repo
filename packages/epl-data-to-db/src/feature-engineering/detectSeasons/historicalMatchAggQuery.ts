import { MongoClient } from "mongodb";
import { historicalMatches } from "@gvhinks/epl-constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const historicalMatchAggQuery = (client: MongoClient, dbName: string, query: object[]): any => {
  return client.db(dbName).collection(historicalMatches).aggregate(query).toArray();
}

export default  historicalMatchAggQuery;
