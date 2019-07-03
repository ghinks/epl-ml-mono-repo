# epl-ml-mono-repo

[![Greenkeeper badge](https://badges.greenkeeper.io/ghinks/epl-ml-mono-repo.svg)](https://greenkeeper.io/)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

## Experimental Repo epl-ml-mono-repo
- EPL [English Premier League](https://www.premierleague.com/)
- ML [Machine Learning](https://tensorflow.org/js/)
- mono-repo [Lerna based JS mono repo](https://github.com/lerna/lerna#readme)

### This is an experimental project intended to test the following technologies

- tensorflow 
- typescript
- lerna
- greenkeeper/renovate/regenerate

The intention for this project is to overcome the learning required to build a predictive
engine from EPL resuls win, loose and draw over the lifetime of the EPL in order to make
an engine to predict future games.

As with all academic exercises it is hoped that the experiences gained from the testing
and use of this may be applied in a general way to other data sets so that a prediction 
may be made.

### requirements

#### Mongo
To run the integration tests a mongo db is required. Mongo is to be run on port 27107. 
Although this demonstration program could be run from a JSON file a decision to use 
mongo will allow the development of the model.

### Installation

#### Lerna Installation
If lerna is installed globally run lerna bootstrap in the root folder. Otherwise do
you can install lerna globally yourself.

```bash
npm i -g lerna
```
or carry out an npm install in the root folder and lerna will install, then export 
the node_modules .bin folder into your PATH.

```bash
npm i
export PATH=$PATH:./node_modules/.bin

```

#### Build
Build the packages with the following command

```bash
lerna run build
```

#### Host the model
It will be necessary to run the model host as it provides the end points for the 
client and the client host which hosts the frontend

goto the packages epl-host-model folder and run the program to host the model.

```bash
cd packages/epl-host-model
npm run start

```

This will start a server that runs on port 3000 that serves the TensorFlow model and weights file.


#### Run a front end prdection

goto the epl-client folder.


```bash
cd packages epl-client
npm run start

```

#### Bring up the front end
The front end may be viewed on **http://localhost:1234**. This is the default for **parcel** 
based client applications.
