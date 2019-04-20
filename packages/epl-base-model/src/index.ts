import * as tf from "@tensorflow/tfjs-node";
import getTrainingData, { BaseResult, flattenResultProps, FlattenedProps } from "./getModelData";
import { TensorLike3D } from "@tensorflow/tfjs-core/dist/types";

const learningRate: number = 10;

const createModel = async (): Promise<tf.Sequential> => {
  const model: tf.Sequential = tf.sequential();
  model.add(tf.layers.dense({inputShape: [3], units: 1, useBias: true}));
  model.add(tf.layers.dense({units: 1, useBias: true}));
  model.summary();
  const rawData: BaseResult[] = await getTrainingData("Arsenal");
  const flattenedData: FlattenedProps= flattenResultProps(rawData);
  const tensors = tf.tensor3d(flattenedData.values, [flattenedData.tensorCount, 3, 1]);
  model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});
  return model;
};

export { getTrainingData, BaseResult, createModel as default };
