import * as tf from "@tensorflow/tfjs-node";
import getTrainingData, { TrainingData, getNames } from "./getModelData";
import save from "./saveModel";
import { numAllTimeTeams } from "@gvhinks/epl-constants";
// import { promises as fsProm } from 'fs';
// import * as path from 'path';
// const fsProm = fs.promises;

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
  /*
  const trainingData = await getTrainingData( new Date(2018, 1, 1), new Date(2020, 1, 1))
  await fsProm.writeFile(path.join(__dirname, "../src/testData/testingFeatureValues.json"), JSON.stringify(trainingData.featureValues), "utf-8");
  await fsProm.writeFile(path.join(__dirname, "../src/testData/testingLabelValues.json"), JSON.stringify(trainingData.labelValues), "utf-8")
  */
  // const numTeamsInLeague: number = (featureValues[0][0]).length;
  const featureTensors = tf.tensor2d(featureValues, [featureValues.length/numFeatureCols, numFeatureCols], 'int32');
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
