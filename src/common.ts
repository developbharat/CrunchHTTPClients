// ===============================
//       TYPINGS
// ===============================
export interface IDeviceTask {}

export interface IDeviceTaskResult {}

// ===============================
//       COMMON FUNCTIONS
// ===============================

/**
 * Returns a list of tasks available for device to solve.
 */
export const listDeviceTasks = async (): Promise<IDeviceTask[]> => {
  // TODO: Method not implemented.
  throw new Error("Method not implemented.");
};

/**
 * Processes provided device tasks and returns their results.
 */
export const solveTasks = async (tasks: IDeviceTask[]): Promise<IDeviceTaskResult[]> => {
  return await Promise.all(tasks.map(solveTask));
};

/**
 * Submits Tasks to backend and returns a list of ids of tasks submitted.
 */
export const uploadSolvedTasks = async (data: IDeviceTaskResult[]): Promise<string[]> => {
  // TODO: Method not implemented.
  throw new Error("Method not implemented.");
};

// ===============================
//       UTILITY FUNCTIONS
// ===============================

/**
 * Utility function to solve single task and return its result
 */
const solveTask = async (task: IDeviceTask): Promise<IDeviceTaskResult> => {};
