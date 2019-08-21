import writeToDB, { renameHistoricalProps, MatchData, writeFutureFixtures } from "./index";
import { MatchResult, Fixture, StandardResult } from "@gvhinks/epl-data-reader";
import * as mongodb from "mongodb";
jest.mock("mongodb");

describe("Mongo DB tests", (): void => {
  interface MockInsertMany {
    insertMany(): Promise<boolean>;
  }
  interface MockDB {
    createCollection(): Promise<MockInsertMany>;
    dropCollection(): Promise<boolean>;
  }
  describe("Historical Raw Data Transformations", (): void => {
    const rawResult: MatchResult = {
      AC:  "5",
      AF:  "8",
      AR:  "0",
      AS:  "13",
      AST:  "4",
      AY:  "1",
      AwayTeam: "Leicester",
      Date: "2018-08-10",
      FTAG:  "1",
      FTHG:  "2",
      FTR: "H",
      HC:  "2",
      HF:  "11",
      HR:  "0",
      HS:  "8",
      HST:  "6",
      HTAG:  "0",
      HTHG:  "1",
      HTR: "H",
      HY:  "2",
      HomeTeam: "Man United",
      Referee: "A Marriner"
    };

    describe("Passing tests", (): void => {
      beforeAll(
        (): void => {
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
        }
      );
      afterAll(
        (): void => {
          jest.clearAllMocks();
        }
      );
      test("expect to write data", async (): Promise<void> => {
        const stdRes: StandardResult = {
          Date: new Date(rawResult.Date),
          HomeTeam: rawResult.HomeTeam,
          AwayTeam: rawResult.AwayTeam,
          Referee: rawResult.Referee,
          FTR: rawResult.FTR
        };
        const result = await writeToDB([stdRes]);
        expect(result).toBe(true);
      });
      test("expect to get MatchData from MatchResult", (): void => {
        const stdRes: StandardResult = {
          Date: new Date(rawResult.Date),
          HomeTeam: rawResult.HomeTeam,
          AwayTeam: rawResult.AwayTeam,
          Referee: rawResult.Referee,
          FTR: rawResult.FTR
        };
        const result: MatchData[] = renameHistoricalProps([stdRes]);
        expect(result[0].homeTeam).toBe("Man United");
      });
    });
    describe("Failing tests", (): void => {
      beforeAll(
        (): void => {
          mongodb.MongoClient.connect.mockImplementation(
            (): Promise<Error> => Promise.reject(new Error("Simulated Error"))
          );
        }
      );
      afterAll(
        (): void => {
          jest.clearAllMocks();
        }
      );
      test("expect to get an error", async (): Promise<void> => {
        const stdRes: StandardResult = {
          Date: new Date(rawResult.Date),
          HomeTeam: rawResult.HomeTeam,
          AwayTeam: rawResult.AwayTeam,
          Referee: rawResult.Referee,
          FTR: rawResult.FTR
        };
        const result = await writeToDB([stdRes]);
        expect(result).toBe(false);
      });
    });
  });
  describe("Future Fixtures", (): void => {
    const rawResult: Fixture =   {
      roundNumber: 1,
      date: new Date("09/08/2019 20:00"),
      location: "Anfield",
      homeTeam: "Liverpool",
      awayTeam: "Norwich"
    };
    beforeAll(
      (): void => {
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
      }
    );
    afterAll(
      (): void => {
        jest.clearAllMocks();
      }
    );
    describe("Passing tests", (): void => {
      test("Expect to write data", async (): Promise<void> => {
        const result = await writeFutureFixtures([rawResult]);
        expect(result).toBe(true);
      });
    });
    describe("Failing tests", (): void => {
      beforeAll(
        (): void => {
          mongodb.MongoClient.connect.mockImplementation(
            (): Promise<Error> => Promise.reject(new Error("Simulated Error"))
          );
        }
      );
      afterAll(
        (): void => {
          jest.clearAllMocks();
        }
      );
      test("expect to get an error", async (): Promise<void> => {
        const result = await writeFutureFixtures([rawResult]);
        expect(result).toBe(false);
      });
    });
  });
});


