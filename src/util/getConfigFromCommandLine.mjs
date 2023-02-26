import minimist from "minimist";
import fs from "fs";

function getConfigFromCommandLine() {
  const argv = minimist(process.argv.slice(2));
  const configFilePath = argv.config;
  const configJson = JSON.parse(fs.readFileSync(configFilePath).toString());
  return configJson;
}

export default getConfigFromCommandLine;
