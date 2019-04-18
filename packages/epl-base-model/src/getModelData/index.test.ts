import getData, { BaseResult } from "./index";
import mongodb from "mongodb";
jest.mock("mongodb");

describe("Data Retrieval", (): void => {
  interface TeamResult {
    homeTeam: string;
    fullTimeResult: string;
  };
  interface MockFindResult {
    toArray(): Promise<TeamResult[]>;
  };
  interface MockCollectionResult {
    find(): MockFindResult;
  };
  interface MockDBResult {
    collection(): MockCollectionResult;
  };
  describe("Passing Tests", (): void => {
    beforeAll((): void => {
      mongodb.MongoClient.connect.mockResolvedValue({
        db: (): MockDBResult => {
          return {
            collection: (): MockCollectionResult => ({
              find: (): MockFindResult => ({
                toArray: (): Promise<TeamResult[]> => Promise.resolve([{
                  homeTeam: "team1",
                  fullTimeResult: "H"
                }])
              })
            })
          };
        }
      });
    });
    afterAll((): void => {
      jest.clearAllMocks();
    });
    test("expect to get winning match results for team1", async (): Promise<void> => {
      const results: BaseResult[] = await getData("team1");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].win).toBeTruthy();
    })
    test("expect to get loosing match results for team2", async (): Promise<void> => {
      const results: BaseResult[] = await getData("team2");
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].win).toBeFalsy();
    })
  })
  describe("Failing Tests", (): void => {
    interface MockFindResult {
      toArray(): Promise<Error>;
    };
    interface MockCollectionResult {
      find(): MockFindResult;
    };
    interface MockDBResult {
      collection(): MockCollectionResult;
    };
    let errorSpy;
    beforeAll((): void => {
      mongodb.MongoClient.connect.mockResolvedValue({
        db: (): MockDBResult => {
          return {
            collection: (): MockCollectionResult => ({
              find: (): MockFindResult => ({
                toArray: (): Promise<Error> => Promise.reject(new Error("thrown")),
              })
            })
          };
        }
      });
      errorSpy = jest.spyOn(console, "error").mockImplementation((): null => null);
    });
    afterAll((): void => {
      jest.clearAllMocks();
      errorSpy.mockRestore();
    });
    test("expect not to get match results for Accrington Stanley", async (): Promise<void> => {
      const results: BaseResult[] = await getData("Arsenal");
      expect(results.length).toBe(0);
      expect(errorSpy).toHaveBeenCalled();
    })
  })
});
