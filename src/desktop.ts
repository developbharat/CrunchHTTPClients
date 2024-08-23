import path from "path";
import { isDeviceAuthenticated, listDeviceTasks, solveTasks, uploadSolvedTasks, wait } from "./common";

interface IDesktopConfigFile {
  endpoint: string;
  deviceId: string;
}

const loadDesktopConfigFile = async (): Promise<IDesktopConfigFile> => {
  const defaultJsonContent = '{\n\t"endpoint": "http://localhost:4000/graphql",\n\t"deviceId": "4a8e31fc19f63746"\n}';
  const file = Bun.file(path.join(process.cwd(), "crunch.http.config.json"));

  if (!file.exists()) {
    file.writer().write(defaultJsonContent);
    console.info("Created config file with default values.");
  }

  try {
    const parsed = JSON.parse(await file.text()) as IDesktopConfigFile;
    if (!parsed.deviceId || !parsed.endpoint) {
      file.writer().write(defaultJsonContent);
      console.error("[RESTORED] Invalid contents of config.json detected. Please update file with valid values.");
      process.exit(1);
    }

    return parsed;
  } catch (err) {
    file.writer().write(defaultJsonContent);
    console.error("[RESTORED] Invalid contents of config.json detected. Please update file with valid values.");
    process.exit(1);
  }
};

export const main = async (): Promise<void> => {
  // Read desktop configuration file
  const options = await loadDesktopConfigFile();

  // check if device is authenticated
  const isAuthenticated = await isDeviceAuthenticated(options);
  if (!isAuthenticated) {
    console.error("Device is not authenticated. Please check your config file with valid details.");
    process.exit(1);
  }

  while (true) {
    // list all tasks to process
    const tasks = await listDeviceTasks(options);
    console.log(`Downloaded ${tasks.length} tasks.`);

    if (tasks.length == 0) {
      await wait(2000); // wait for 2 seconds
      continue;
    }

    // solve tasks
    const results = await solveTasks(tasks);
    console.log(`Solved ${results.length} tasks.`);

    // upload solved tasks online
    const ids = await uploadSolvedTasks(options, results);
    console.log(`Uploaded ${ids.length} tasks.`);
  }
};

main().catch(console.error);
