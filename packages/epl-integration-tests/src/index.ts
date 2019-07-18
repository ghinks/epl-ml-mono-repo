import createModel, { save } from "@gvhinks/epl-base-model";
import * as tf from "@tensorflow/tfjs-node";
import * as path from "path";

const makeTheModel = async (): Promise<void> => {
  try {
    const model: tf.Sequential = await createModel();
    const targetFolder = path.resolve(path.join(__dirname, "../../epl-host-model/model"))
    save(model, `file://${targetFolder}`);
  } catch (e) {
    console.error(Array(100).join("#"));
    console.error(e.message);
    console.error(Array(100).join("#"));
  }
};

makeTheModel().then((): void => console.log("finished making the model"));
