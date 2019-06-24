import { standardize, createPredictionResult, createTeamNameLookup } from "./index";
import teamNames from "./teamNames"

describe("test utils", () => {
  const arsenal = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  const villa = [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  describe("standandize", () => {
    test("standardise expect binary 1,0,0", () => {
      const testPrediction: number[] = [ 0.9, 0.8, 0.7];
      const result: number[] = standardize(testPrediction);
      expect(result[0]).toEqual(1);
      expect(result[1]).toEqual(0);
      expect(result[2]).toEqual(0);
    });
    test("standardise expect binary 0,1,0", () => {
      const testPrediction: number[] = [ 0.05, 0.95, 0.7];
      const result: number[] = standardize(testPrediction);
      expect(result[0]).toEqual(0);
      expect(result[1]).toEqual(1);
      expect(result[2]).toEqual(0);
    });
    test("standardise expect binary 0,0,1", () => {
      const testPrediction: number[] = [ 0.05, 0.10,0.85];
      const result: number[] = standardize(testPrediction);
      expect(result[0]).toEqual(0);
      expect(result[1]).toEqual(0);
      expect(result[2]).toEqual(1);
    });
  });
  describe("createPredictionResult", () => {

    const hotEncodedNames = [arsenal, villa];
    const teamNames: Map<string, string> = new Map([[`${arsenal}`, "arsenal"], [`${villa}`, "villa"]]);
    const mockModel = {
      predict: () => ({
        data: async (): Promise<number[]> => Promise.resolve([0.1, 0.2, 0.3])
      })
    };
    const testLabelValues = [0,0,1];
    test("expect a prediction result", async (): void => {
      const result = await createPredictionResult(mockModel, hotEncodedNames, teamNames, testLabelValues);
      expect(result.standardizedResult[0]).toEqual(0);
      expect(result.standardizedResult[1]).toEqual(0);
      expect(result.standardizedResult[2]).toEqual(1);
    });
  });
  describe("Team name reverse lookup", (): void => {
    test("arsenal", () => {
      const teams = createTeamNameLookup();
      const name = teams.get(`${arsenal}`);
      expect(name).toEqual("Arsenal");
    });
    test("villa", () => {
      const teams = createTeamNameLookup();
      const name = teams.get(`${villa}`);
      expect(name).toEqual("Aston Villa");
    });
  });
});
