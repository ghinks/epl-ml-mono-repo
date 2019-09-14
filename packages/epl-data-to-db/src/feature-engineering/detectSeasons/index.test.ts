import { calculateSeasonDates, getSeasonGamePlayedIn, SeasonGamePlayedIn } from "./index";
import historicalMatchAggQuery from "./historicalMatchAggQuery";
import { Season } from "@gvhinks/epl-common-interfaces";

jest.mock("./historicalMatchAggQuery");

// @ts-ignore
const mockQ = (historicalMatchAggQuery as jest.Mocked);
mockQ.mockImplementationOnce(() => {
  return [{
    firstGame: new Date("2000-09-19T04:00:00.000Z")
  }];
})
  .mockImplementationOnce(() => {
    return [{
      firstGame: new Date("2000-09-19T04:00:00.000Z"),
      lastGame: new Date("2001-06-19T04:00:00.000Z")
    }];
  })
  .mockImplementationOnce(() => {
    return [{
      firstGame: null,
      lastGame: null
    }];
  })


describe("Get Season Data", (): void => {
  test("calculate season dates", async (): Promise<void> => {
    const result: Season[] = await calculateSeasonDates();
    expect(result).toBeInstanceOf(Array);
    expect(result[0].seasonNumber).toEqual(2);
  });
  test("get the season the game was played in", (): null => {
    const seasons: Season[] = [
      {
        startDate: new Date("2000-09-19T04:00:00.000Z"),
        endDate: new Date("2001-06-19T04:00:00.000Z"),
        seasonNumber: 1
      },
      {
        startDate: new Date("2001-09-19T04:00:00.000Z"),
        endDate: new Date("2002-06-19T04:00:00.000Z"),
        seasonNumber: 2
      },
      {
        startDate: new Date("2002-09-19T04:00:00.000Z"),
        endDate: new Date("2003-06-19T04:00:00.000Z"),
        seasonNumber: 3
      },
      {
        startDate: new Date("2003-09-19T04:00:00.000Z"),
        endDate: new Date("2004-06-19T04:00:00.000Z"),
        seasonNumber: 4
      },
    ];
    let result = getSeasonGamePlayedIn(new Date("2000-10-19T04:00:00.000Z"), seasons );
    expect(result).toEqual(1);
    result = getSeasonGamePlayedIn(new Date("2003-10-19T04:00:00.000Z"), seasons );
    expect(result).toEqual(4);
  })
});
