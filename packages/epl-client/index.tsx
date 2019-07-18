import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import loadModel from './src/loadModel'
import * as tf from '@tensorflow/tfjs';
import { getFixtures, getPredictions, collateTable } from "@gvhinks/epl-season-forecast";
import { Fixture, FixturePrediction, Forecast } from "@gvhinks/epl-common-interfaces";

// TODO this should use the utils library but the
// tensor flow types for browser and node caused
// a type mismatch
// import getOneHotEncoding from './src/getOneHotEncoding'
import { getOneHotEncoding, standardize } from "@gvhinks/epl-utilities";

console.log('Hello from tsx!')
ReactDOM.render(
  <p className='mytest'>Hello</p>,
  document.getElementById('root'),
)

const carryOutModelExperiment = async (): Promise<void> => {
  try {
    const before = window.performance.now();
    const model: tf.LayersModel = await loadModel();
    console.log(window.performance.now() - before);
    const Chelsea = getOneHotEncoding("Chelsea");
    const WestHam = getOneHotEncoding("West Ham");
    const testData = tf.tensor3d([ ...Chelsea, ...WestHam], [1,2,43], 'int32');
    const prediction = model.predict(testData);
    const result = await prediction.data();
    console.log(window.performance.now() - before);
    const standardResult: number[] = standardize(result);
    console.log(standardResult);

    const fixtures: Fixture[] = await getFixtures();
    const predictions: FixturePrediction[] = await getPredictions(fixtures, model);
    const table: Forecast[] = collateTable(predictions);
    console.log(JSON.stringify(table, null, 2));
  } catch (e) {
    console.error(e.message);
  }


};

carryOutModelExperiment()
.then(() => console.log('prediction was made'))
.catch(e => console.error(e.message));
