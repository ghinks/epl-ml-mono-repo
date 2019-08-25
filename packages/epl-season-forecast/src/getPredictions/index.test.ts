import * as tf from '@tensorflow/tfjs';
import { getPredictions } from "./index";
import { Fixture, FixturePrediction } from "@gvhinks/epl-common-interfaces";

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
    predict: (): object => ({
      data: async (): Promise<number[]> => Promise.resolve([0.1, 0.2, 0.3])
    })
  };
  test("expect to get no errors", async (): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const mockLayersModel: tf.LayersModel = <tf.LayersModel><unknown>mockModel;
      const results: FixturePrediction[] = await getPredictions(fixtures, mockLayersModel);
      expect(results.length).toBe(1);
      expect(results[0].standardizedResult[2]).toBe(1);
    } catch (e) {
      console.error(e.message);
      fail();
    }
  });
});
