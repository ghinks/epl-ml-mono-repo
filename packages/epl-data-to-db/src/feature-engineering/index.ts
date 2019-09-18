import { calculateSeasonDates } from "./detectSeasons";
import { Season } from "@gvhinks/epl-common-interfaces";
import * as mongodb from "mongodb";
import { url, dbName, historicalMatches } from "@gvhinks/epl-constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function* updateSeason(client: mongodb.MongoClient): AsyncIterable<any> {
  const seasons: Season[] = await calculateSeasonDates();
  for (let i = 0; i < seasons.length; i++) {
    const filter = {
      Date: {
        $gte: seasons[i].startDate,
        $lte: seasons[i].endDate
      }
    };
    const update = {
      $set: {
        seasonNumber: seasons[i].seasonNumber
      }
    };
    yield client.db(dbName).collection(historicalMatches).updateMany(filter, update);
  }
}

const updateFeatures = async (): Promise<number[]> => {
  let client: mongodb.MongoClient;
  const updateResults: number[] = [];
  try {
    client = await mongodb.MongoClient.connect(url, { useNewUrlParser: true });
    for await (const update of updateSeason(client)) {
      console.log(update.matchedCount);
      updateResults.push(update.matchedCount);
    }
  } catch (e) {
    console.log(Array(50).join("#"));
    console.error(e.message);
  } finally {
    if (client) {
      client.close();
    }
  }
  return updateResults;
};

export { updateFeatures as default }
