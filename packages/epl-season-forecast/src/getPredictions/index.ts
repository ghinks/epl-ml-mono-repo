import { Fixture, Forecast } from "@gvhinks/epl-common-interfaces";
import * as tf from '@tensorflow/tfjs';
import { getOneHotEncoding, standardize } from "@gvhinks/epl-utilities";
import { numAllTimeTeams } from "@gvhinks/epl-constants";

const getPredictions = async (seasonsFixtures: Fixture[], model: tf.LayersModel): Promise<void> => {
  const fixTensor: tf.Tensor3D[] = seasonsFixtures.map((fixture: Fixture): tf.Tensor3D => {
    const homeTeam: number[] = getOneHotEncoding(fixture.homeTeam);
    const awayTeam: number[] = getOneHotEncoding(fixture.awayTeam);
    return tf.tensor3d([...homeTeam, ...awayTeam], [1, 2, numAllTimeTeams])
  });
  const predictData = fixTensor.map((fx: tf.Tensor3D): tf.Tensor | tf.Tensor[] => model.predict(fx));
  // @ts-ignore
  const predictions = predictData.map(prediction => prediction.data());
  const resolvedPredictions = await Promise.all(predictions);
  const standardizedResults = resolvedPredictions.map(p => standardize(p));
};

export { getPredictions };
