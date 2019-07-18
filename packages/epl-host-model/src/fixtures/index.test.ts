import * as mongodb from "mongodb";
import { Fixture } from "@gvhinks/epl-data-reader";
import { readFixtures } from "./index";

jest.mock("mongodb");

describe("Fixtures retrieval", (): void => {
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
  describe("Passing tests", (): void => {
    beforeAll(
      (): void => {
        mongodb.MongoClient.connect.mockResolvedValue({
          db: (): MockDBResult => {
            return {
              collection: (): MockCollectionResult => ({
                find: (): MockFindResult => ({
                  toArray: (): Promise<Fixture[]> =>
                    Promise.resolve([
                      {
                        roundNumber: 0,
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
    test("Expect to get fixtures", async (): Promise<void> => {
      const result = await readFixtures();
      expect(result.length).toBeGreaterThan(0);
    });
  });
  describe("Failing tests", (): void => {
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
      })
    test("expect an empty array", async (): void => {
      const result = await readFixtures();
      expect(result.length).toBe(0);
      expect(errorSpy).toHaveBeenCalled();
    })
  });
})
