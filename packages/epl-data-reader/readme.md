# match reader

Data is provided for the [English Premier League](http://www.football-data.co.uk/) via a [zip](https://datahub.io/sports-data/english-premier-league#data)

The data is read from file in the format 

```markdown
export interface MatchResult {
  AC: string;
  AF: string;
  AR: string;
  AS: string;
  AST: string;
  AY: string;
  AwayTeam: string;
  Date: string;
  FTAG: string;
  FTHG: string;
  FTR: string;
  HC: string;
  HF: string;
  HR: string;
  HS: string;
  HST: string;
  HTAG: string;
  HTHG: string;
  HTR: string;
  HY: string;
  HomeTeam: string;
  Referee: string;
}
```
The interface takes a path and all the json files in that path are read from and expected to follow the format

```markdown
[
  {
    "AC": 5,
    "AF": 8,
    "AR": 0,
    "AS": 13,
    "AST": 4,
    "AY": 1,
    "AwayTeam": "Leicester",
    "Date": "2018-08-10",
    "FTAG": 1,
    "FTHG": 2,
    "FTR": "H",
    "HC": 2,
    "HF": 11,
    "HR": 0,
    "HS": 8,
    "HST": 6,
    "HTAG": 0,
    "HTHG": 1,
    "HTR": "H",
    "HY": 2,
    "HomeTeam": "Man United",
    "Referee": "A Marriner"
  },
  {
    "AC": 4,
    "AF": 9,
    "AR": 0,
    "AS": 10,
    "AST": 1,
    "AY": 1,
    "AwayTeam": "Cardiff",
    "Date": "2018-08-11",
    "FTAG": 0,
    "FTHG": 2,
    "FTR": "H",
    "HC": 7,
    "HF": 11,
    "HR": 0,
    "HS": 12,
    "HST": 4,
    "HTAG": 0,
    "HTHG": 1,
    "HTR": "H",
    "HY": 1,
    "HomeTeam": "Bournemouth",
    "Referee": "K Friend"
  }
]

```
