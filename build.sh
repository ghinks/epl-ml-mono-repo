#!/usr/bin/env bash

cd packages/epl-data-reader
npm install
npm run build
cd ../epl-data-to-db
npm install
npm run build
cd ../../
