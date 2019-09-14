import { calculateSeasonDates } from "./index";
import historicalMatchAggQuery from "./historicalMatchAggQuery";

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
    const result = await calculateSeasonDates();
    expect(result).toBeInstanceOf(Array);
    expect(result[0].seasonNumber).toEqual(2);
  });
});
