// import createModel, { getTrainingData, TrainingData, save } from "@gvhinks/epl-base-model";
// import * as tf from "@tensorflow/tfjs-node";
// import { createArrPrdFuncReqs, createTeamNameLookup, getOneHotEncoding } from "@gvhinks/epl-utilities";
/*import { io } from "@tensorflow/tfjs-core";
import * as fs from "fs";
import { PredictResult } from "@gvhinks/epl-common-interfaces";
import { numAllTimeTeams } from "@gvhinks/epl-constants";*/

// const LONG_TEST = 5 * 60 * 1000;

describe("Integration Tests", (): void => {
  /*  const Chelsea = getOneHotEncoding("Chelsea");
    const WestHam = getOneHotEncoding("West Ham");*/

  const Chelsea = [
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0
  ];

  const WestHam = [
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0,
    0
  ];

  /*  async function predictChelseaWestHam(model): Promise<void> {
      const testData = tf.tensor3d([...Chelsea, ...WestHam], [1, 2, numAllTimeTeams], "int32");
      const prediction = model.predict(testData);
      // @ts-ignore
      const result = await prediction.data();
      expect(result.length).toBe(3);
      const sumOfWeights = result[0] + result[1] + result[2];
      expect(sumOfWeights).toBeGreaterThan(0.90);
      expect(sumOfWeights).toBeLessThan(1.15);
    }*/

  describe("Model Functional Tests", (): void => {
    test("trial", () => {
      console.log(Chelsea);
      console.log(WestHam);
      expect(true).toBeTruthy();
    });
    /*    afterAll((): void => {
          //remove test files if they exist
          const files = [`${__dirname}/model.json`, `${__dirname}/weights.bin`];
          files.forEach((file): void => {
            try {
              if (fs.existsSync(file)) {
                fs.unlinkSync(file);
              }
            } catch (e) {
              console.log(e.message);
            }
          });
        });*/
    /*    test("expect to create a model and make a prediction", async (): Promise<void> => {
          const model = await createModel();
          // await predictChelseaWestHam(model);
        }, LONG_TEST);*/
    /*    test("test a model using the reserved 2019 test data set", async (): Promise<void> => {
          const allTeamNames = createTeamNameLookup();
          const model = await createModel();
          const { labelValues: testLabels, featureValues: testFeatures } = await getTrainingData(new Date(2019, 1, 1), new Date(2020, 7, 1));
          const mytests = createArrPrdFuncReqs(model, testFeatures, allTeamNames, testLabels);
          const predTests: Promise<PredictResult>[] = mytests.map((t): Promise<PredictResult> => t());
          const matchResults: PredictResult[] = await Promise.all(predTests);
          let total = 0;
          let matches = 0;
          matchResults.forEach((r): void => {
            console.log(r);
            total += 1;
            if (r.comparison) {
              matches++;
            }
          });
          console.log(`total = ${total} success rate = ${matches / total}`);
          expect(matches / total).toBeGreaterThan(0.5);
        }, LONG_TEST);
        test("Given a model save it to the file system", async (): Promise<void> => {
          const model: tf.Sequential = tf.sequential({
            layers: [
              tf.layers.dense({ inputShape: [784], units: 32, activation: "relu" }),
              tf.layers.dense({ units: 10, activation: "softmax" })
            ]
          });
          const path = `file://${__dirname}`;
          const result: io.SaveResult = await save(model, path);
          expect(result).toBeTruthy();
        }, LONG_TEST);*/
  });
});
