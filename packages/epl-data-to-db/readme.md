# EPL-DATA-TO-DB

## Purpose
Although there are many relational and non relational DBs to choose 
from I have choosen to store the data in a mongodb. If I were to
choose a relational DB my preference would be postgres.

### Interface

The Data is presented to this module as an Array of 
**MatchResult** objects but is stored in the format below

```markdown
interface MatchData {
  awayTeamCorners: number;
  awayTeamFouls: number;
  awayTeamReds: number;
  awayTeamShots: number;
  awayTeamShotsOnTarget: number;
  awayTeamYellowCards: number;
  AwayTeam: string;
  Date: string;
  fullTimeAwayGoals: number;
  fullTimeHomeGoals: number;
  fullTimeResult: string;
  homeTeamCorners: number;
  homeTeamFouls: number;
  homeTeamRedCards: number;
  homeTeamShots: number;
  homeTeamShotsOnTarget: number;
  halfTimeAwayTeamGoals: number;
  halfTimeHomeTeamGoals: number;
  halfTimeResult: string;
  homeTeamYellowCards: number;
  homeTeam: string;
  referee: string;
}
```
