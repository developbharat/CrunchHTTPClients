import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { parse } from "graphql";
import { gql } from "graphql-request";

// ===============================
//       TYPINGS
// ===============================

export interface IGqlClientDevice {
  id: string;
  name: string;
  device_id: string;
  device_type: string;
  created_at: string;
}

export interface IGqlClientDeviceTask {
  id: string;
  method: string;
  path: string;
  headers: string;
  data: string;
  success_status_codes: number[];
  max_retries: number;
  expires_at: string;
  status: string;
  created_at: string;
}

export interface ISolvedTaskInput {
  task_id: string;
  headers: string;
  data: string;
  is_success: boolean;
  status: string;
  status_code: number;
}

// ===============================
//       QUERIES
// ===============================
export const isDeviceAuthenticatedGql: TypedDocumentNode<{ isDeviceAuthenticated: IGqlClientDevice }, {}> = parse(gql`
  query isDeviceAuthenticated {
    isDeviceAuthenticated {
      id
      name
      device_id
      device_type
      created_at
    }
  }
`);

export const listClientDeviceTasksGql: TypedDocumentNode<{ listClientDeviceTasks: IGqlClientDeviceTask[] }, {}> =
  parse(gql`
    query listClientDeviceTasks {
      listClientDeviceTasks {
        id
        method
        path
        headers
        data
        success_status_codes
        max_retries
        expires_at
        status
        created_at
      }
    }
  `);

export const uploadSolvedTasksGql: TypedDocumentNode<
  { submitHttpTaskResults: string[] },
  { data: ISolvedTaskInput[] }
> = parse(gql`
  mutation submitHttpTaskResults($data: [SubmitHttpTaskResultInput!]!) {
    submitHttpTaskResults(data: $data)
  }
`);
