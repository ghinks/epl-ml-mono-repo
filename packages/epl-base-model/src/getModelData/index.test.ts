import getData, {
  BaseResult,
  flattenLabels,
  isHomeWin,
  isAwayWin,
  isDraw,
  FlattenedProps, flattenFeatures
} from "./index";
// @ts-ignore
import mongodb from "mongodb";
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
        mongodb.MongoClient.connect.mockResolvedValue({
          db: (): MockDBResult => {
            return {
              collection: (): MockCollectionResult => ({
                distinct: (): Promise<string[]> => Promise.resolve(mockedTeamNames),
                find: (): MockFindResult => ({
                  toArray: (): Promise<TeamResult[]> =>
                    Promise.resolve([
                      {
                        homeTeam: "team1",
                        fullTimeResult: "H"
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
    test("expect to get results for all teams", async (): Promise<
      void
      > => {
      const results: BaseResult[] = await getData();
      expect(results.length).toBeGreaterThan(0);
    });
    test("expect to get winning match results for team1", async (): Promise<
      void
    > => {
      const results: BaseResult[] = await getData();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].homeWin).toBeTruthy();
    });
    test("expect flatten labels", (): void => {
      const rawData: BaseResult = {
        // oneHot encoded
        awayTeam: [1, 0, 0, 0],
        homeTeam: [0, 1, 0, 0],
        homeWin: 1,
        awayWin: 0,
        draw: 0
      };
      const flattened: number[][] = flattenLabels([rawData, rawData]);
      expect(flattened.length).toBe(2);
    });
    test("expect to flatten features", (): void => {
      const rawData: BaseResult = {
        // oneHot encoded
        awayTeam: [1, 0, 0, 0],
        homeTeam: [0, 1, 0, 0],
        homeWin: 1,
        awayWin: 0,
        draw: 0
      };
      const flattened: number[][][] = flattenFeatures([rawData, rawData]);
      expect(flattened[0][0].length).toBe(4);
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
    test("expect not to get match results for Accrington Stanley", async (): Promise<
      void
    > => {
      const results: BaseResult[] = await getData("Arsenal");
      expect(results.length).toBe(0);
      expect(errorSpy).toHaveBeenCalled();
    });
  });
});
