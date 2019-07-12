import * as path from "path";
import { promises as fspromises } from "fs";

const readModelJson = async (): Promise<string> => {
  const fileName = "model.json";
  const filePath = path.resolve(path.join(__dirname, "../../model"), fileName);
  console.log(filePath);
  const data = await fspromises.readFile(filePath, "utf8");
  return JSON.parse(data);
};

const modelHandler = async (request, reply): Promise<void> => {
  console.log(request.params);
  console.log(request.headers);
  const data = await readModelJson();
  reply.type("application/json").code(200).send(data);
};

export { readModelJson, modelHandler }
