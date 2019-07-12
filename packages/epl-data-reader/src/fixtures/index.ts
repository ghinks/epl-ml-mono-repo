import * as fs from "fs";
import * as path from "path";

interface Fixture {
  roundNumber: number;
  date: Date;
  location: string;
  homeTeam: string;
  awayTeam: string;
};

const getFixtures = async (): Promise<Fixture[]> => {
  const fileName: string = path.join(__dirname, "../../data/futureFixtures/eplSeason2020.json");
  const rawData: object[] = JSON.parse(await fs.promises.readFile(fileName, "utf-8"));
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

export { getFixtures as default, Fixture }
