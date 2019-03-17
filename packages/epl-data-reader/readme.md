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

| name | item# | type | description |
|------|-------|------|-------------|
| Date	|1 |	date (%Y-%m-%d)	| Match Date (dd/mm/yy) |
| HomeTeam	| 2 |	string (default)| 	Home Team |
AwayTeam	| 3 |	string (default)| 	Away Team |
FTHG	| 4 |	integer (default)| 	Full Time Home Team Goals |
FTAG	| 5 |	integer (default)| 	Full Time Away Team Goals |
FTR	| 6 |	string (default)| 	Full Time Result (H=Home Win, D=Draw, A=Away Win) |
HTHG	| 7 |	integer (default)| 	Half Time Home Team Goals |
HTAG	| 8 |	integer (default)| 	Half Time Away Team Goals |
HTR	| 9 |	string (default)| 	Half Time Result (H=Home Win, D=Draw, A=Away Win) |
Referee	| 10 |	string (default)| 	Match Referee |
HS	| 11 |	integer (default)| 	Home Team Shots |
AS	| 12 |	integer (default)| 	Away Team Shots |
HST	|13 |	integer (default)| 	Home Team Shots on Target |
AST	| 14 |	integer (default)| 	Away Team Shots on Target |
HF	| 15 |	integer (default)| 	Home Team Fouls Committed |
AF	| 16 |	integer (default)| 	Away Team Fouls Committed |
HC	| 17 |	integer (default)| 	Home Team Corners |
AC	| 18 |	integer (default)| 	Away Team Corners |
HY	| 19 |	integer (default)| 	Home Team Yellow Cards |
AY	| 20 |	integer (default)| 	Away Team Yellow Cards |
HR	| 21 |	integer (default)| 	Home Team Red Cards |
AR	| 22 |	integer (default)| 	Away Team Red Cards |



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
