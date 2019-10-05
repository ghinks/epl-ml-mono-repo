import { Fixture, FixturePrediction } from "@gvhinks/epl-common-interfaces";
import * as tf from '@tensorflow/tfjs';
import { getOneHotEncoding, standardize } from "@gvhinks/epl-utilities";
import { numAllTimeTeams } from "@gvhinks/epl-constants";

const numFeatureCols = 2 * numAllTimeTeams + 1;

const getPredictions = async (seasonsFixtures: Fixture[], model: tf.LayersModel): Promise<FixturePrediction[]> => {
  const fixTensor: tf.Tensor2D[] = seasonsFixtures.map((fixture: Fixture): tf.Tensor2D => {
    const homeTeam: number[] = getOneHotEncoding(fixture.homeTeam);
    const awayTeam: number[] = getOneHotEncoding(fixture.awayTeam);
    // TODO hard coded season 19 for testing purposes
    return tf.tensor2d([...homeTeam, ...awayTeam, 19], [1, numFeatureCols])
  });
  const predictData = fixTensor.map((fx: tf.Tensor2D): tf.Tensor | tf.Tensor[] => model.predict(fx));
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const rawPredictions = predictData.map(prediction => prediction.data());
  const resolvedPredictions = await Promise.all(rawPredictions);
  const predictResults: FixturePrediction[] = resolvedPredictions.map((p: number[], i): FixturePrediction => {
    const standardizedResult = standardize(p);
    const fxPrd: FixturePrediction = { ...seasonsFixtures[i], standardizedResult }
    return fxPrd;
  });
  return predictResults;
};

export { getPredictions };
