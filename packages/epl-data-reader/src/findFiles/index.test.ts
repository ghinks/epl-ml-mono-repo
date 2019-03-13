import { findDataFiles, readMatchResult } from "./index";
import path from "path";

describe("Read test data files", () => {
  test("expect to find 2 json files", async () => {
    const testDataPath: string = path.join(__dirname, "testData");
    const files: string[] = await findDataFiles(testDataPath);
    expect(files.length).toBe(2);
  });
  test("expect to read match result data from test data", async () => {
    const testDataPath: string = path.join(__dirname, "testData");
    const files: string[] = await findDataFiles(testDataPath);
    const fullyQualifiedFiles: string[] = files.map(
      file => `${path.join(__dirname, "testData")}/${file}`
    );
    const testFile1: string = fullyQualifiedFiles[0];
    const matches = await readMatchResult(testFile1);
    expect(matches.length).toBeGreaterThan(0);
  });
});
