import writeToDB, { renameProps, MatchData } from "./index";
import { MatchResult } from "@gvhinks/epl-data-reader";
import mongodb from "mongodb";
jest.mock("mongodb");

describe("Raw Data Transformations", () => {
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
  describe("Passing tests", () => {
    beforeAll(() => {
      mongodb.MongoClient.connect.mockResolvedValue({
        close: () => null,
        db: () => {
          return {
            createCollection: () =>
              Promise.resolve({
                insertMany: () => Promise.resolve(true)
              }),
            dropCollection: () => Promise.resolve(true)
          };
        }
      });
    });
    afterAll(() => {
      jest.clearAllMocks();
    });
    test("expect to write data", async () => {
      const result = await writeToDB([rawMatchResult]);
      expect(result).toBe(true);
    });
    test("expect to get MatchData from MatchResult", () => {
      const result: MatchData[] = renameProps([rawMatchResult]);
      expect(result[0].homeTeam).toBe("Man United");
    });
  });
  describe("Failing tests", () => {
    beforeAll(() => {
      mongodb.MongoClient.connect.mockImplementation(() =>
        Promise.reject(new Error("Simulated Error"))
      );
    });
    afterAll(() => {
      jest.clearAllMocks();
    });
    test("expect to get an error", async () => {
      const result = await writeToDB([rawMatchResult]);
      expect(result).toBe(false);
    });
  });
});
