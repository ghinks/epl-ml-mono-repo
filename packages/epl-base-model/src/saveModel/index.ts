import * as tf from "@tensorflow/tfjs-node";
import { io } from '@tensorflow/tfjs-core';

const save = async (model: tf.Sequential, path: string = __dirname ): Promise<io.SaveResult>=> {
  try {
    return await model.save(path);
  } catch (e) {
    console.error(Array(100).join("*"));
    console.error("  The model was not saved")
    console.error(e.message);
    console.error(Array(100).join("*"));
  }
};

export default save;
