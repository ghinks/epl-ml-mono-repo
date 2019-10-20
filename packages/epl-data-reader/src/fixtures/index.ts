import { promises as fsProm } from "fs";
import * as path from "path";
import { Fixture } from "@gvhinks/epl-common-interfaces";


const getFixtures = async (): Promise<Fixture[]> => {
  const fileName: string = path.join(__dirname, "../../data/futureFixtures/eplSeason2020.json");
  const rawData: object[] = JSON.parse(await fsProm.readFile(fileName, "utf-8"));
  const fixtures: Fixture[] = rawData.map((data): Fixture => {
    const match = data["Date"].match(/(\d+)\/(\d+)\/(\d+).*/);
    return {
      roundNumber: data["Round Number"],
      date: new Date(match[3], match[2], match[1]),
      location: data["Location"],
      homeTeam: data["Home Team"],
      awayTeam: data["Away Team"]
    }
  });
  return fixtures;
};

export { getFixtures as default }
