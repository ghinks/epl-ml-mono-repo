import { MongoClient } from "mongodb";
import { url, dbName } from "@gvhinks/epl-constants";
import historicalMatchAggQuery from "./historicalMatchAggQuery";

const getNextGameFrom = async (client: MongoClient, from?: Date): Promise<Date> => {
  const query: object[] = [];
  if (from) {
    const isoDate = new Date(from.toISOString());
    const match = {
      $match: {
        Date: { $gt: isoDate }
      }
    }
    query.push(match)
  }
  const group = {
    $group: {
      _id: {}, firstGame: { $min: "$Date" }
    }
  };
  query.push(group);

  const projection = {
    $project: {
      _id: false,
      firstGame: true
    }
  };
  query.push(projection);
  const result = await historicalMatchAggQuery(client, dbName, query);
  const nextGame = result[0].firstGame;
  return nextGame;
};

interface Season {
  startDate: Date;
  endDate: Date;
  seasonNumber: number;
}

const getNextSeason = async (client: MongoClient, lastSeasonNum: number, startDate: Date): Promise<Season> => {
  const estSeasonEnd = new Date(startDate.getTime());
  estSeasonEnd.setMonth(estSeasonEnd.getMonth()+11);
  const query = {
    $match: {
      Date: { $gte: startDate , $lte: estSeasonEnd}
    }
  };
  const group = {
    $group: {
      _id: {},
      firstGame: { $min: "$Date"},
      lastGame: { $max: "$Date"}
    }
  };
  const projection = {
    $project: {
      _id: false,
      firstGame: true,
      lastGame: true
    }
  };
  const result = await historicalMatchAggQuery(client, dbName, [query, group, projection]);
  const theNextSeason: Season = {
    startDate: result.length ? result[0].firstGame : null,
    endDate: result.length ? result[0].lastGame: null,
    seasonNumber: lastSeasonNum + 1
  }
  return theNextSeason;
};

async function* getSeasons(client: MongoClient): AsyncIterable<Season> {
  let startDate: Date = await getNextGameFrom(client);
  const today = new Date();
  let seasonNumber = 1;
  let prevSeason: Season = null;
  while (startDate < today) {
    const upcomingSeason = await getNextSeason(client, seasonNumber, startDate);
    seasonNumber++;
    if (upcomingSeason.endDate) {
      startDate = await getNextGameFrom(client, upcomingSeason.endDate);
    } else {
      //increment the startDate by one year
      startDate = await getNextGameFrom(client, prevSeason.endDate);
    }
    prevSeason = upcomingSeason;
    yield upcomingSeason;
  }
}

const calculateSeasonDates = async(): Promise<Season[]> => {
  let client: MongoClient;
  const seasons: Season[] = [];
  try {
    client = await MongoClient.connect(url, { useNewUrlParser: true });
    for await (const season of getSeasons(client)) {
      if (season.startDate) {
        seasons.push(season);
      }
    }
  } catch (e) {
    console.log(Array(50).join("#"));
    console.error(e.message);
  } finally {
    if (client) {
      client.close();
    }
  }
  return seasons;
};

export { calculateSeasonDates, getNextSeason }
