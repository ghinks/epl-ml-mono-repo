import updateFeatures from "./index"
import * as mongodb from "mongodb";
import * as detectSeasons from "./detectSeasons"
import { Season } from "@gvhinks/epl-common-interfaces"
jest.mock("mongodb");
jest.mock("./detectSeasons");

describe("Feature Engineering", () => {
  beforeAll(() => {
    const seasons: Season[] = [
      {
        startDate: new Date("2000-09-19T04:00:00.000Z"),
        endDate:  new Date("2001-06-19T04:00:00.000Z"),
        seasonNumber: 1
      },
      {
        startDate: new Date("2001-09-19T04:00:00.000Z"),
        endDate:  new Date("2002-06-19T04:00:00.000Z"),
        seasonNumber: 2
      },
      {
        startDate: new Date("2002-09-19T04:00:00.000Z"),
        endDate:  new Date("2003-06-19T04:00:00.000Z"),
        seasonNumber: 3
      }
    ];
    // @ts-ignore
    detectSeasons.calculateSeasonDates.mockResolvedValue(seasons)
    mongodb.MongoClient.connect.mockResolvedValue({
      close: (): void => null,
      db: (): object => ({
        collection: (): object => ({
          updateMany: async (): Promise<object> => Promise.resolve({ matchedCount: 1})
        })
      })
    });
  });
  afterAll(
    (): void => {
      jest.clearAllMocks();
    }
  );
  test("expect to update features", async (): Promise<void> => {
    const result = await updateFeatures();
    expect(result.length).toBeGreaterThan(1);
  });
});
