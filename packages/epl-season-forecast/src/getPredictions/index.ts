import { Fixture, FixturePrediction } from "@gvhinks/epl-common-interfaces";
import * as tf from '@tensorflow/tfjs';
import { getOneHotEncoding, standardize } from "@gvhinks/epl-utilities";
import { numAllTimeTeams } from "@gvhinks/epl-constants";

const getPredictions = async (seasonsFixtures: Fixture[], model: tf.LayersModel): Promise<FixturePrediction[]> => {
  const fixTensor: tf.Tensor3D[] = seasonsFixtures.map((fixture: Fixture): tf.Tensor3D => {
    const homeTeam: number[] = getOneHotEncoding(fixture.homeTeam);
    const awayTeam: number[] = getOneHotEncoding(fixture.awayTeam);
    return tf.tensor3d([...homeTeam, ...awayTeam], [1, 2, numAllTimeTeams])
  });
  const predictData = fixTensor.map((fx: tf.Tensor3D): tf.Tensor | tf.Tensor[] => model.predict(fx));
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const rawPredictions = predictData.map(prediction => prediction.data());
  const resolvedPredictions = await Promise.all(rawPredictions);
  const predictResults: FixturePrediction[] = resolvedPredictions.map((p: number[], i): FixturePrediction => {
    const standardizedResult = standardize(p);
    /*    const fxPrd: FixturePrediction = {
      roundNumber: seasonsFixtures[i].roundNumber,
      date: seasonsFixtures[i].date,
      location: seasonsFixtures[i].location,
      homeTeam: seasonsFixtures[i].homeTeam,
      awayTeam: seasonsFixtures[i].awayTeam,
      standardizedResult: standardizedResult
    };*/
    const fxPrd: FixturePrediction = { ...seasonsFixtures[i], standardizedResult }
    return fxPrd;
  });
  return predictResults;
};

export { getPredictions };
