# `@gvhinks/epl-integration-tests`

## integration testing

```bash
npm test
```

Running these tests will populate the mongodb (destructively for the matches collection), build a model and run test
data over that model for the second half of the 2018/2019 season and compare the predicted results with those real
results.

## Re-building the model
To rebuild the model stored in the **epl-host-model** package run 

```bash
npm run start
```
