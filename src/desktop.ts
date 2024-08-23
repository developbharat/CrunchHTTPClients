import { listDeviceTasks, solveTasks, uploadSolvedTasks } from "./common";

const wait = (ms: number) => new Promise((resolve, _) => setTimeout(resolve, ms));

export const main = async (): Promise<void> => {
  while (true) {
    // list all tasks to process
    const tasks = await listDeviceTasks();
    console.log(`Downloaded ${tasks.length} tasks.`);

    if (tasks.length == 0) {
      await wait(2000); // wait for 2 seconds
      continue;
    }

    // solve tasks
    const results = await solveTasks(tasks);
    console.log(`Solved ${results.length} tasks.`);

    // upload solved tasks online
    const ids = await uploadSolvedTasks(results);
    console.log(`Uploaded ${ids.length} tasks.`);
  }
};

main().catch(console.error);
