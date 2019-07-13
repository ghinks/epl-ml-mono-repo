import { getFixtures } from "./index";
import { Fixture } from "@gvhinks/epl-common-interfaces";
import * as mongodb from "mongodb";
jest.mock("mongodb");

describe("forecast", (): void => {
  interface MockFindResult {
    toArray(): Promise<Fixture[]>;
  }
  interface MockCollectionResult {
    distinct(): Promise<string[]>;
    find(): MockFindResult;
  }
  interface MockDBResult {
    collection(): MockCollectionResult;
  }
  beforeAll(
    (): void => {
      mongodb.MongoClient.connect.mockResolvedValue({
        db: (): MockDBResult => {
          return {
            collection: (): MockCollectionResult => ({
              distinct: (): Promise<string[]> => Promise.resolve(mockedTeamNames),
              find: (): MockFindResult => ({
                toArray: (): Promise<Fixture[]> =>
                  Promise.resolve([
                    {
                      roundNumber: 1,
                      date: new Date(),
                      location: "place",
                      homeTeam: "teamA",
                      awayTeam: "teamB"
                    }
                  ])
              })
            })
          };
        }
      });
    }
  );
  afterAll(
    (): void => {
      jest.clearAllMocks();
    }
  );
  test("expect to pass", async (): Promise<void> => {
    const forecasts = await getFixtures();
    expect(forecasts.length).toEqual(1);
  });
});
