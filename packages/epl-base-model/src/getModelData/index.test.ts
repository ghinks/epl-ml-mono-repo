import getData, { BaseResult } from "./index";
import mongodb from "mongodb";
jest.mock("mongodb");

describe("Data Retrieval", () => {
  describe("Passing Tests", () => {
    beforeAll(() => {
      mongodb.MongoClient.connect.mockResolvedValue({
        db: () => {
          return {
            collection: () => ({
              find: () => ({
                toArray: () => Promise.resolve([{
                  homeTeam: "team1",
                  result: "W"
                }])
              })
            })
          };
        }
      });
    });
    afterAll(() => {
      jest.clearAllMocks();
    });
    test("expect to get match results for Arsenal", async () => {
      const results: BaseResult[] = await getData("Arsenal");
      expect(results.length).toBeGreaterThan(0);
    })
  })
  describe("Failing Tests", () => {
    beforeAll(() => {
      mongodb.MongoClient.connect.mockResolvedValue({
        db: () => {
          return {
            collection: () => ({
              find: () => ({
                toArray: () => Promise.reject(new Error("thrown")),
              })
            })
          };
        }
      });
    });
    afterAll(() => {
      jest.clearAllMocks();
    });
    test("expect not to get match results for Accrington Stanley", async () => {
      const results: BaseResult[] = await getData("Arsenal");
      expect(results.length).toBe(0);
    })
  })
});
