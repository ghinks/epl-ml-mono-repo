import forecast from "./index";

describe("forecast", (): void => {
  test("expect to pass", (): void => {
    expect(forecast()).toBeTruthy();
  });
});
