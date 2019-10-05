import * as tf from "@tensorflow/tfjs-node";
import getTrainingData, { TrainingData, getNames } from "./getModelData";
import save from "./saveModel";
import { numAllTimeTeams } from "@gvhinks/epl-constants";

const createModel = async (): Promise<tf.Sequential> => {
  const numFeatureCols = 2 * numAllTimeTeams + 1;
  const model: tf.Sequential = tf.sequential({
    name: "predict"
  });
  model.add(tf.layers.dense({inputShape: [numFeatureCols], units: 3, useBias: true, name:"teams_layer"}));
  // model.add(tf.layers.flatten());
  model.add(tf.layers.dense({units: 3, useBias: true, name: "results_layer"}));
  model.compile({optimizer: tf.train.adam(0.001), loss: 'meanSquaredError'});
  const { labelValues, featureValues } = await getTrainingData();
  // const numTeamsInLeague: number = (featureValues[0][0]).length;
  const featureTensors = tf.tensor2d(featureValues, [featureValues.length/87, numFeatureCols], 'int32');
  const labelTensors = tf.tensor2d(labelValues, [labelValues.length, 3], 'int32');
  const fitArgs = {
    batchSize: 380,
    epochs: 200,
    verbose: 0,
    shuffle: true
  };
  await model.fit(featureTensors, labelTensors, fitArgs);
  return model;
};

export { getTrainingData, createModel as default, TrainingData, getNames, save };
