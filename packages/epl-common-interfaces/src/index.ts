interface Forecast {
  position: number;
  team: string;
  wins: number;
  loses: number;
  draws: number;
  points: number;
};

interface Fixture {
  roundNumber: number;
  date: Date;
  location: string;
  homeTeam: string;
  awayTeam: string;
};

export { Forecast, Fixture };
