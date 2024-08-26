import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  isDeviceAuthenticated,
  listDeviceTasks,
  solveTasks,
  uploadSolvedTasks,
  wait,
  type ICommonOptions,
} from "./common";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Record started_at to exit function after 19 minutes.
  const ends_at = new Date();
  ends_at.setMinutes(ends_at.getMinutes() + 19);

  // Read aws lambda configuration file
  const options: ICommonOptions = {
    deviceId: process.env.CRUNCH_HTTP_DEVICE_ID!,
    endpoint: process.env.CRUNCH_HTTP_ENDPOINT!,
  };
  if (!options.deviceId || options.endpoint) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status:
          "Environment variables for AWS Lambda functions are not set. Please set CRUNCH_HTTP_DEVICE_ID and CRUNCH_HTTP_ENDPOINT",
      }),
    };
  }

  // check if device is authenticated
  const isAuthenticated = await isDeviceAuthenticated(options);
  if (!isAuthenticated) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: "Device is not authenticated. Please check your config file with valid details.",
      }),
    };
  }

  while (true) {
    // Exit gracefully after 19 minutes
    if (new Date().getTime() > ends_at.getTime()) {
      return {
        statusCode: 200,
        body: JSON.stringify({ status: `Function gracefully completed after 19 minutes.` }),
      };
    }

    // list all tasks to process
    const tasks = await listDeviceTasks(options);
    console.log(`Downloaded ${tasks.length} tasks.`);

    if (tasks.length === 0) {
      await wait(500); // wait for 500 milliseconds
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
