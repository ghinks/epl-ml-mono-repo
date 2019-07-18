import getHistoricalData, { getJSONTenYearData, StandardResult, getCsvData } from "./index";

describe("Read JSON data", (): void => {
  test("expect to get standard results back from json files", async (): Promise<void> => {
    const results: StandardResult[] = await getJSONTenYearData();
    expect(results.length).toBeGreaterThan(3000);
  });
  test("expect to get standard results from csv files", async (): Promise<void> => {
    const maxDate = new Date("Fri Aug 14 2009 20:00:00 GMT-0400");
    const results: StandardResult[] = await getCsvData(maxDate);
    expect(results.length).toBeGreaterThan(3000);
  });
  test("expect to get combined data", async (): Promise<void> => {
    const results = await getHistoricalData();
    expect(results.length).toBeGreaterThan(6000);
  });
});
