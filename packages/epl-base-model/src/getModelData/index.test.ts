import getTrainingData, {
  isHomeWin,
  isAwayWin,
  isDraw,
} from "./index";
import * as mongodb from "mongodb";
jest.mock("mongodb");

describe("Data Retrieval", (): void => {
  const mockedTeamNames: string[] = ["team1", "team2"];
  interface TeamResult {
    homeTeam: string;
    fullTimeResult: string;
  }
  interface MockFindResult {
    toArray(): Promise<TeamResult[]>;
  }
  interface MockCollectionResult {
    distinct(): Promise<string[]>;
    find(): MockFindResult;
  }
  interface MockDBResult {
    collection(): MockCollectionResult;
  }
  describe("Passing Tests", (): void => {
    beforeAll(
      (): void => {
        // @ts-ignore
        mongodb.MongoClient.connect.mockResolvedValue({
          db: (): MockDBResult => {
            return {
              collection: (): MockCollectionResult => ({
                distinct: (): Promise<string[]> => Promise.resolve(mockedTeamNames),
                find: (): MockFindResult => ({
                  toArray: (): Promise<TeamResult[]> =>
                    Promise.resolve([
                      {
                        homeTeam: mockedTeamNames[0],
                        awayTeam: mockedTeamNames[1],
                        fullTimeResult: "H",
                        seasonNumber: 1
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
    test("expect home win to be a 1", (): void => {
      const result = {
        homeTeam: "team1",
        fullTimeResult: "H"
      };
      expect(isHomeWin(result)).toBe(1);
    });
    test("expect away win to be a 1", (): void => {
      const result = {
        awayTeam: "team1",
        fullTimeResult: "A"
      };
      expect(isAwayWin(result)).toBe(1);
    });
    test("expect home team lose to be a 0", (): void => {
      const result = {
        homeTeam: "team1",
        fullTimeResult: "A"
      };
      expect(isHomeWin(result)).toBe(0);
    });
    test("expect a draw", (): void => {
      const result = {
        homeTeam: "team1",
        fullTimeResult: "D"
      };
      expect(isDraw(result)).toBe(1);
    });
    test("expect to get results for all teams", async (): Promise<void> => {
      const { featureValues, labelValues } = await getTrainingData();
      expect(labelValues.length).toBeGreaterThan(0);
      expect(featureValues.length).toBeGreaterThan(0);
    });
    test("expect to get winning match results for team1", async (): Promise<void> => {
      const { featureValues, labelValues } = await getTrainingData();
      expect(labelValues.length).toBeGreaterThan(0);
      expect(labelValues[0]).toMatchObject([1, 0, 0]);
      expect(featureValues).toMatchObject([1, 0, 0, 1, 1])
    });
  });
  describe("Failing Tests", (): void => {
    interface MockFindResult {
      toArray(): Promise<Error>;
    }
    interface MockCollectionResult {
      find(): MockFindResult;
    }
    interface MockDBResult {
      collection(): MockCollectionResult;
    }
    let errorSpy;
    beforeAll(
      (): void => {
        // @ts-ignore
        mongodb.MongoClient.connect.mockResolvedValue({
          db: (): MockDBResult => {
            return {
              collection: (): MockCollectionResult => ({
                find: (): MockFindResult => ({
                  toArray: (): Promise<Error> =>
                    Promise.reject(new Error("thrown"))
                })
              })
            };
          }
        });
        errorSpy = jest
          .spyOn(console, "error")
          .mockImplementation((): null => null);
      }
    );
    afterAll(
      (): void => {
        jest.clearAllMocks();
        errorSpy.mockRestore();
      }
    );
    test("expect not to get match results", async (): Promise<void> => {
      const { featureValues } = await getTrainingData(new Date("1971-12-17T03:24:00"), new Date("1972-12-17T03:24:00"));
      expect(featureValues.length).toBe(0);
      expect(errorSpy).toHaveBeenCalled();
    });
  });
});
