import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import loadModel from './src/loadModel'
import * as tf from '@tensorflow/tfjs';
import getOneHotEncoding from './src/getOneHotEncoding'

console.log('Hello from tsx!')
ReactDOM.render(
  <p className='mytest'>Hello</p>,
  document.getElementById('root'),
)

const carryOutModelExperiment = async (): Promise<void> => {
  const model: tf.LayersModel = await loadModel();
  const Chelsea = getOneHotEncoding("Chelsea");
  const WestHam = getOneHotEncoding("West Ham");
  const testData = tf.tensor3d([ ...Chelsea, ...WestHam], [1,2,36], 'int32');
  const prediction = model.predict(testData);
  const result = await prediction.data();
  console.log(result);
};

carryOutModelExperiment()
.then(() => console.log('prediction was made'))
.catch(e => console.error(e.message));
