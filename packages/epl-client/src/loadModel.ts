import * as tf from '@tensorflow/tfjs';

const loadModel = async (): Promise<tf.LayersModel> => {
  try {
    const url = "http://localhost:3000/model.json"
    const result: tf.LayersModel = await tf.loadLayersModel(url);
    console.log(result);
    return result;
  } catch (e) {
    console.error(Array(100).join("#"));
    console.error(e.message);
  }
};

export default loadModel;
