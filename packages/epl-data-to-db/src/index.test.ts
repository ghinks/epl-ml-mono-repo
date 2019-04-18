import writeToDB, { renameProps, MatchData } from "./index";
import { MatchResult } from "@gvhinks/epl-data-reader";
import mongodb from "mongodb";
jest.mock("mongodb");

describe("Raw Data Transformations", (): void => {
  const rawMatchResult: MatchResult = {
    AC: 5,
    AF: 8,
    AR: 0,
    AS: 13,
    AST: 4,
    AY: 1,
    AwayTeam: "Leicester",
    Date: "2018-08-10",
    FTAG: 1,
    FTHG: 2,
    FTR: "H",
    HC: 2,
    HF: 11,
    HR: 0,
    HS: 8,
    HST: 6,
    HTAG: 0,
    HTHG: 1,
    HTR: "H",
    HY: 2,
    HomeTeam: "Man United",
    Referee: "A Marriner"
  };
  interface MockInsertMany {
    insertMany(): Promise<boolean>;
  };
  interface MockCreateCollection {
    createCollection(): MockInsertMany;
  };
  interface MockDropCollection {
    dropCollection(): Promise<boolean>;
  };
  interface MockDB {
    createCollection(): Promise<MockInsertMany>;
    dropCollection(): Promise<boolean>;
  };
  describe("Passing tests", (): void => {
    beforeAll((): void => {
      mongodb.MongoClient.connect.mockResolvedValue({
        close: (): void => null,
        db: (): MockDB => {
          return {
            createCollection: (): Promise<MockInsertMany> =>
              Promise.resolve({
                insertMany: (): Promise<boolean> => Promise.resolve(true)
              }),
            dropCollection: (): Promise<boolean> => Promise.resolve(true)
          };
        }
      });
    });
    afterAll((): void => {
      jest.clearAllMocks();
    });
    test("expect to write data", async (): Promise<void> => {
      const result = await writeToDB([rawMatchResult]);
      expect(result).toBe(true);
    });
    test("expect to get MatchData from MatchResult", (): void => {
      const result: MatchData[] = renameProps([rawMatchResult]);
      expect(result[0].homeTeam).toBe("Man United");
    });
  });
  describe("Failing tests", (): void => {
    beforeAll((): void => {
      mongodb.MongoClient.connect.mockImplementation((): Promise<Error> =>
        Promise.reject(new Error("Simulated Error"))
      );
    });
    afterAll((): void => {
      jest.clearAllMocks();
    });
    test("expect to get an error", async (): Promise<void> => {
      const result = await writeToDB([rawMatchResult]);
      expect(result).toBe(false);
    });
  });
});
