import { GraphQLClient, request } from "graphql-request";
import {
  isDeviceAuthenticatedGql,
  listClientDeviceTasksGql,
  uploadSolvedTasksGql,
  type IGqlClientDevice,
  type IGqlClientDeviceTask,
  type ISolvedTaskInput,
} from "./common/queries";

// ===============================
//       TYPINGS
// ===============================
export interface ICommonOptions {
  endpoint: string;
  deviceId: string;
}

// ===============================
//       COMMON FUNCTIONS
// ===============================
export const wait = (ms: number) => new Promise((resolve, _) => setTimeout(resolve, ms));

export const isDeviceAuthenticated = async (options: ICommonOptions): Promise<IGqlClientDevice | null> => {
  try {
    const data = await request(options.endpoint, isDeviceAuthenticatedGql, {}, { Authorization: options.deviceId });
    return data.isDeviceAuthenticated;
  } catch (err) {
    return null;
  }
};
/**
 * Returns a list of tasks available for device to solve.
 */
export const listDeviceTasks = async (options: ICommonOptions): Promise<IGqlClientDeviceTask[]> => {
  try {
    const data = await request(options.endpoint, listClientDeviceTasksGql, {}, { Authorization: options.deviceId });
    return data.listClientDeviceTasks;
  } catch (err) {
    return [];
  }
};

/**
 * Processes provided device tasks and returns their results.
 */
export const solveTasks = async (tasks: IGqlClientDeviceTask[]): Promise<ISolvedTaskInput[]> => {
  return await Promise.all(tasks.map(solveTask));
};

/**
 * Submits Tasks to backend and returns a list of ids of tasks submitted.
 */
export const uploadSolvedTasks = async (options: ICommonOptions, data: ISolvedTaskInput[]): Promise<string[]> => {
  try {
    const client = new GraphQLClient(options.endpoint, {
      method: "POST",
      headers: { Authorization: options.deviceId },
    });
    const res = await client.request(uploadSolvedTasksGql, { data: data });
    return res.submitHttpTaskResults;
  } catch (err) {
    console.log({ err });
    return [];
  }
};

// ===============================
//       UTILITY FUNCTIONS
// ===============================

/**
 * Utility function to solve single task and return its result
 */
const solveTask = async (task: IGqlClientDeviceTask): Promise<ISolvedTaskInput> => {
  let failure: ISolvedTaskInput = {
    task_id: task.id,
    data: "",
    headers: "",
    is_success: false,
    status: "Desktop Client error occurred",
    status_code: 0,
  };

  while (task.max_retries != 0) {
    // increment attempts
    task.max_retries--;

    // make http request
    try {
      const result = await fetch(task.path, {
        method: task.method,
        body: task.data,
        headers: JSON.parse(task.headers),
      });

      // Return result if request successful
      if (task.success_status_codes.includes(result.status)) {
        return {
          task_id: task.id,
          headers: JSON.stringify(result.headers),
          data: await result.text(),
          is_success: true,
          status: result.statusText,
          status_code: result.status,
        };
      }

      // Consider it a failure if status code is not listed in success_status_codes
      failure = {
        task_id: task.id,
        headers: JSON.stringify(result.headers),
        data: await result.text(),
        is_success: false,
        status: result.statusText,
        status_code: result.status,
      };
      continue;
    } catch (err) {
      // Consider it a failure if fetch raises exception
      failure = {
        task_id: task.id,
        headers: "",
        data: "",
        is_success: false,
        status: (err as Error).message,
        status_code: 0,
      };

      // wait for 2 seconds before next attempt, and
      // skip waiting if this is our last attempt
      if (task.max_retries !== 0) await wait(2000);
    }
  }

  // Return failure
  return failure;
};
