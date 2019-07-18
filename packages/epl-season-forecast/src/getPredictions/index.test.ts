import { getPredictions } from "./index";
import { Fixture, FixturePredictions } from "@gvhinks/epl-common-interfaces";

describe("Fixture Predictions", (): void => {
  const fixtures: Fixture[] = [
    {
      roundNumber: 1,
      date: new Date(),
      location: "place A",
      homeTeam: "Arsenal",
      awayTeam: "Aston Villa"
    }
  ];
  const mockModel = {
    predict: (): void => ({
      data: async (): Promise<number[]> => Promise.resolve([0.1, 0.2, 0.3])
    })
  };
  test("expect to get no errors", async (): Promise<void> => {
    try {
      const results: FixturePredictions[] = await getPredictions(fixtures, mockModel);
      expect(results.length).toBe(1);
      expect(results[0].standardizedResult[2]).toBe(1);
    } catch (e) {
      console.error(e.message);
      fail();
    }
  });
});
