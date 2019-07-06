import * as fs from "fs";
import * as path from "path";

interface FutureGame {
  roundNumber: number;
  date: Date;
  location: string;
  homeTeam: string;
  awayTeam: string;
};

const getFutureData = async (): Promise<FutureGame[]> => {
  const fileName: string = path.join(__dirname, "../../data/futureFixtures/eplSeason2020.json");
  const rawData: object[] = JSON.parse(await fs.promises.readFile(fileName, "utf-8"));
  const fixtures: FutureGame[] = rawData.map((data): FutureGame => {
    return {
      roundNumber: data["Round Number"],
      date: new Date(data["Date"]),
      location: data["Location"],
      homeTeam: data["Home Team"],
      awayTeam: data["Away Team"]
    }
  });
  return fixtures;
};

export { getFutureData as default, FutureGame }
