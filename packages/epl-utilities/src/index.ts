import * as tf from "@tensorflow/tfjs-node";
import teamsArray from "./teamNames";

// result so that console op is ok to view
interface PredictResult {
  homeTeam: string;
  awayTeam: string;
  standardizedResult: number[];
  actualResult: number[];
  comparison: boolean;
  result: number[];
};

// type for a predictive test function
type AsyncPredResult = () => Promise<PredictResult>;

// standardize an array of predictions from a floating
// point array to binary array with the largest float set
// to unity and the others set to zero
const standardize = (prediction: number[]): number[] => {
  const maxValue = prediction.reduce((a, c): number => {
    if (c > a) {
      return c
    }
    return a;
  }, 0)
  return prediction.map((v): number => {
    if (v < maxValue) {
      return 0;
    }
    return 1;
  })
};

// create on prediction result by running the features
// which are hot encoded through the model
const createPredictionResult = async (model: tf.Sequential,
  hotEncodedNames: number[][],
  teamNames: Map<string, string>,
  testLabelValues: number[]): Promise<PredictResult> => {
  const testData = tf.tensor3d([...hotEncodedNames[0], ...hotEncodedNames[1]], [1, 2, 36], "int32");
  const prediction = model.predict(testData);
  // @ts-ignore
  const result: number[] = await prediction.data();
  return {
    homeTeam: teamNames.get(`${hotEncodedNames[0]}`),
    awayTeam: teamNames.get(`${hotEncodedNames[1]}`),
    standardizedResult: standardize(result),
    actualResult: testLabelValues,
    comparison: `${standardize(result)}` === `${testLabelValues}`,
    result
  };
};

// create an array of test prediction functions that once
// executed would produce a prediction
const createArrPrdFuncReqs = (model: tf.Sequential,
  testFeatures: number[][][],
  teamNames: Map<string, string>,
  testLabels: number[][]): AsyncPredResult[] => {
  let mytests = testFeatures.map((hotEncodedNames, i): AsyncPredResult => {
    const predictionTest = async (): Promise<PredictResult> => {
      return await createPredictionResult(model, hotEncodedNames, teamNames, testLabels[i]);
    }
    return predictionTest;
  });
  return mytests;
};


// string based looked to take a string version of the one hot
// encoded team name and turn it back into the human known team name.
// convert 1,0,0,...0 to Arsenal
const createTeamNameLookup = (): Map<string, string> => {
  // @ts-ignore
  const teams: string[][] = teamsArray.reduce((a, c): string[] => {
    // @ts-ignore
    return [...a, [`${c[1]}`, c[0]]]
  }, []);
  // @ts-ignore
  return new Map(teams);
}

const getOneHotEncoding = (teamName: string): number[] => {
  // @ts-ignore
  const oneHotEncoded: number[] = teamsArray.reduce((a, v): number[] => {
    if (v[0] === teamName) {
      // @ts-ignore
      return v[1];
    }
    // @ts-ignore
    return a;
  }, []);
  return oneHotEncoded;
};

export {
  PredictResult,
  AsyncPredResult,
  createPredictionResult,
  standardize,
  createArrPrdFuncReqs,
  createTeamNameLookup,
  getOneHotEncoding
};
