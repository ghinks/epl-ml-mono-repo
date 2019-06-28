# `@gvhinks/epl-utilities`

Many of the testing utilities that are required to test the "test data" against the model built
from the training data can be used via both unit and integration suites. It is intended that 
bringing these utilities together under a common module will add with that testability.

## PredictionResult

```
interface PredictResult {
  homeTeam: string;
  awayTeam: string;
  standardizedResult: number[];
  actualResult: number[];
  comparison: boolean;
  result: number[];
};
```

When we make a predicition for the EPL it is useful to have a result that is
human readable.

- homeTeam, human readable home team name
- awayTeam, human readable away team name
- standardizedResult, result in binary 0,1,0 format for Win, Draw, Loose, ( mutually exclusive)
- actualResult, an array of floats with weights for Win, Draw, Loose.
- comparison, boolean to show if the test result matched the predicted standardizedResult
- result, the actual test data result

## standardize

A function taking the predicted floating point result array and returning a
standardized binary result.

```markdown
(prediction: number[]): number[]

// [0.1, 0,2, 0.7] would return [0, 0, 1]

``` 

## AsyncPredResult

```markdown
type AsyncPredResult = () => Promise<PredictResult>;
```

A type defining a function that returns a Promise of a PredictResult


