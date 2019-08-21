import getNames from "./index";
import * as mongodb from "mongodb";
jest.mock("mongodb");

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
  } as mongodb.MongoClient;

  beforeAll((): void => {
    // @ts-ignore
    mongodb.MongoClient.connect.mockResolvedValue(mockClient);
  });

  it("expect to get names", async (): Promise<void> => {
    const names = await getNames();
    expect(names.has("team1")).toBeTruthy();
    const oneHot: number[] = names.get("team1");
    expect(oneHot.length).toBe(2);
  });
});
