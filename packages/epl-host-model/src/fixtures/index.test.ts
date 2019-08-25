import * as mongodb from "mongodb";
import { Fixture } from "@gvhinks/epl-data-reader";
import { readFixtures } from "./index";

jest.mock("mongodb");

describe("Fixtures retrieval", (): void => {
  interface MockFindResult {
    toArray(): Promise<Fixture[]>;
  }
  interface MockCollectionResult {
    // distinct(): Promise<string[]>;
    find(): MockFindResult;
  }
  interface MockDBResult {
    collection(): MockCollectionResult;
  }

  const mockData: Fixture[] = [
    {
      roundNumber: 0,
      date: new Date(),
      location: "place",
      homeTeam: "teamA",
      awayTeam: "teamB"
    }
  ];
  describe("Passing tests", (): void => {
    beforeAll(
      (): void => {
        const mockCollection = {
          find: (): MockFindResult => ({
            toArray: (): Promise<Fixture[]> =>
              Promise.resolve(mockData)
          })
        };
        (mongodb.MongoClient.connect as jest.Mock).mockResolvedValue({
          db: (): MockDBResult => {
            return {
              collection: (): MockCollectionResult => mockCollection
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
        const mockCollection = {
          find: (): MockFindResult => ({
            toArray: (): Promise<Fixture[]> =>
              Promise.reject(new Error("thrown"))
          })
        };
        (mongodb.MongoClient.connect as jest.Mock).mockResolvedValue({
          db: (): MockDBResult => {
            return {
              collection: (): MockCollectionResult => mockCollection
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
    test("expect an empty array", async (): Promise<void> => {
      const result = await readFixtures();
      expect(result.length).toBe(0);
      expect(errorSpy).toHaveBeenCalled();
    })
  });
})
