import * as path from "path";
import { promises as fspromises } from "fs";

const readWeights = async (): Promise<Buffer> => {
  const fileName = "weights.bin";
  const filePath = path.resolve(path.join(__dirname, "../../model"), fileName);
  console.log(filePath);
  const data: Buffer = await fspromises.readFile(filePath);
  return data;
};

const weightsHandler = async (request, reply): Promise<void> => {
  console.log(request.params);
  console.log(request.headers);
  const data = await readWeights();
  reply.type("application/octet-stream").code(200).send(data);
};

export { readWeights, weightsHandler }
