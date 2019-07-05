import * as tf from "@tensorflow/tfjs-node";
import getTrainingData, { TrainingData, getNames } from "./getModelData";
import save from "./saveModel"

const createModel = async (): Promise<tf.Sequential> => {
  const model: tf.Sequential = tf.sequential({
    name: "predict"
  });
  model.add(tf.layers.dense({inputShape: [2,43], units: 3, useBias: true, name:"teams_layer"}));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({units: 3, useBias: true, name: "results_layer"}));
  model.compile({optimizer: tf.train.adam(0.001), loss: 'meanSquaredError'});
  const { labelValues, featureValues } = await getTrainingData();
  const numTeamsInLeague: number = (featureValues[0][0]).length;
  const featureTensors = tf.tensor3d(featureValues, [featureValues.length, 2, numTeamsInLeague], 'int32');
  const labelTensors = tf.tensor2d(labelValues, [labelValues.length, 3], 'int32');
  const fitArgs = {
    batchSize: 500,
    epochs: 200,
    verbose: 0
  };
  await model.fit(featureTensors, labelTensors, fitArgs);
  return model;
};

export { getTrainingData, createModel as default, TrainingData, getNames, save };
