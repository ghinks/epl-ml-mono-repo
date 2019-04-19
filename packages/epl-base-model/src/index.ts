import * as tf from "@tensorflow/tfjs-node";
import getData, { BaseResult, flattenResultProps, FlattenedProps } from "./getModelData";
import { TensorLike3D } from "@tensorflow/tfjs-core/dist/types";

const createModel = async (): Promise<tf.Sequential> => {
  const model: tf.Sequential = tf.sequential();
  model.add(tf.layers.dense({inputShape: [3], units: 1, useBias: true}));
  model.add(tf.layers.dense({units: 1, useBias: true}));
  const rawData: BaseResult[] = await getData("Arsenal");
  const flattenedData: FlattenedProps= flattenResultProps(rawData);
  const tensors = tf.tensor3d(flattenedData.values, [flattenedData.tensorCount, 3, 1]);
  return model;
};

export { getData, BaseResult, createModel as default };
