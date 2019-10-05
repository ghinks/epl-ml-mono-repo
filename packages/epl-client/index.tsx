import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import loadModel from './src/loadModel'
import * as tf from '@tensorflow/tfjs';
import { getFixtures, getPredictions, collateTable } from "@gvhinks/epl-season-forecast";
import { Fixture, FixturePrediction, Forecast } from "@gvhinks/epl-common-interfaces";
import { getOneHotEncoding, standardize } from "@gvhinks/epl-utilities";
import ReactTable from 'react-table'
import 'react-table/react-table.css'

const numFeatureCols = 87;

console.log('Hello from tsx!')

async function oneGameTest(model: tf.LayersModel, before) {
  const Chelsea = getOneHotEncoding("Chelsea");
  const WestHam = getOneHotEncoding("West Ham");
  // TODO remove hard coded season
  const testData = tf.tensor2d([...Chelsea, ...WestHam, 19], [1, numFeatureCols], "int32");
  const prediction = model.predict(testData);
  const result = await prediction.data();
  console.log(window.performance.now() - before);
  const standardResult: number[] = standardize(result);
  console.log(standardResult);
}

const carryOutModelExperiment = async (): Promise<void> => {
  try {
    const before = window.performance.now();
    const model: tf.LayersModel = await loadModel();
    console.log(window.performance.now() - before);
    await oneGameTest(model, before);

    const fixtures: Fixture[] = await getFixtures();
    const predictions: FixturePrediction[] = await getPredictions(fixtures, model);
    const table: Forecast[] = collateTable(predictions);
    console.log(JSON.stringify(table, null, 2));
    const columns = [{
      id: 'position',
      Header: 'position',
      accessor: 'position',
      maxWidth: 65
    }, {
      Header: 'team',
      accessor: 'team',
      maxWidth: 120
    }, {
      id: 'wins',
      Header: 'wins',
      accessor: 'wins',
      maxWidth: 65
    }, {
      id: 'loses',
      Header: 'loses',
      accessor: 'loses',
      maxWidth: 65
    }, {
      id: 'draws',
      Header: 'draws',
      accessor: 'draws',
      maxWidth: 65
    }, {
      id: 'points',
      Header: 'points',
      accessor: 'points',
      maxWidth: 65
    }];
    const data = table;
    ReactDOM.render(
      <ReactTable data={data} columns={columns} />,
      document.getElementById('root'),
    )
  } catch (e) {
    console.error(e.message);
  }


};

carryOutModelExperiment()
.then(() => console.log('prediction was made'))
.catch(e => console.error(e.message));
