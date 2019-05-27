import getNames from "./index";
import * as mongodb from "mongodb";

describe("Team names", (): void => {
  // as the client is passed in we can mock
  // it out completely
  const mockedTeamNames: string[] = ["team1", "team2"];
  // @ts-ignore
  const mockClient: mongodb.MongoClient = {
    db: (): object => ({
      collection: (): object => ({
        distinct: (): Promise<string[]> => Promise.resolve(mockedTeamNames)
      })
    })
  };

  it("expect to get names", async (): Promise<void> => {
    const names = await getNames(mockClient);
    expect(names.has("team1")).toBeTruthy();
    const oneHot: number[] = names.get("team1");
    expect(oneHot.length).toBe(2);
  });
});
