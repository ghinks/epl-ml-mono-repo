import * as tf from "@tensorflow/tfjs-node";
import getTrainingData, { BaseResult, flattenResults } from "./getModelData";

const createModel = async (): Promise<tf.Sequential> => {
  const model: tf.Sequential = tf.sequential();
  // we have 3424 test sets
  // each of 2 * 36
  model.add(tf.layers.dense({inputShape: [2,36], units: 3, useBias: true, name:"teams_layer"}));
  model.add(tf.layers.flatten());
  model.add(tf.layers.dense({units: 3, useBias: true, name: "results_layer"}));
  model.summary();
  model.compile({optimizer: tf.train.adam(0.001), loss: 'meanSquaredError'});
  const rawData: BaseResult[] = await getTrainingData();
  const { labelValues, featureValues } = flattenResults(rawData);
  const numTeamsInLeague: number = (featureValues[0][0]).length;
  const featureTensors = tf.tensor3d(featureValues, [featureValues.length, 2, numTeamsInLeague], 'int32');
  const labelTensors = tf.tensor2d(labelValues, [labelValues.length, 3], 'int32');
  const fitArgs = {
    batchSize: 500,
    epochs: 200,
    verbose: 1,
    callbacks: {
      onEpochEnd: (epoch, logs): void => {
        console.log(Array(20).join("*"));
        console.log("my epoch ended")
        console.log(epoch)
        console.log(logs)
      },
      onBatchEnd: (batch, logs): void => {
        console.log(Array(20).join("*"));
        console.log("my batch ended")
        console.log(batch)
        console.log(logs)
      }
    }
  };
  const history = await model.fit(featureTensors, labelTensors, fitArgs);
  console.log(history);
  // const Arsenal = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  const Chelsea = [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  const WestHam = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0];
  // const Everton = [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  const testData = tf.tensor3d([ ...Chelsea, ...WestHam], [1,2,36], 'int32');
  const result = model.predict(testData);
  console.log(Array(100).join("="));
  console.log(await result.data());
  console.log(Array(100).join("="));
  return model;
};

export { getTrainingData, BaseResult, createModel as default };
