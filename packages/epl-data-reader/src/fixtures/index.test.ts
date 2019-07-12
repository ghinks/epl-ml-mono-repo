import getFixtures, { Fixture } from "./index";

describe("Get future games", (): void => {
  test("expect to retrieve future games", async (): Promise<void> => {
    const games: Fixture[] = await getFixtures();
    expect(games.length).toBeGreaterThan(1);
    const minDate = new Date("2019/01/01");
    games.forEach((game: Fixture): void => {
      const result = game.date > minDate;
      if (!result) console.error(`expected ${game.date} > ${minDate} for ${game.homeTeam}`);
      expect(result).toBeTruthy();
    });
  });
});
