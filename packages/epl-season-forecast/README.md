# `@gvhinks/epl-season-forecast`

## epl season forecast

The forecast can provide a the EPL for 
- any round in the season
- the complete season

This forecast package is intended to be used on either the front or the backend.

The program API is 

```javascript
  getForecasteTable(round: number = 0 )
```

Passing a round number of zero will correspond to asking the forecaster for the entire season.

```javascript
interface Forecast {
  position: number;
  team: string;
  wins: number;
  loses: number;
  draws: number;
  points: number;
}
```
A collection of forecasts would provide a league table.


| position | team | wins| loses| draws | points |
|----------|:------:|:-----:|:------:|:-------:|:--------:|
| 1 | Team A | 1 | 2 |1 |4 |
| 2 | Team B | 0 | 2 |2 |2 |

