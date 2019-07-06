import getFutureGames, { FutureGame } from "./index";

describe("Get future games", (): void => {
  test("expect to retrieve future games", async (): Promise<void> => {
    const games: FutureGame[] = await getFutureGames();
    expect(games.length).toBeGreaterThan(1);
  });
});
