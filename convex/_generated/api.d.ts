/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as applications from "../applications.js";
import type * as companies from "../companies.js";
import type * as graph from "../graph.js";
import type * as jobs from "../jobs.js";
import type * as migrateApplications from "../migrateApplications.js";
import type * as recommend from "../recommend.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";
import type * as _lib_matchScore from "../_lib/matchScore.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  applications: typeof applications;
  companies: typeof companies;
  graph: typeof graph;
  jobs: typeof jobs;
  migrateApplications: typeof migrateApplications;
  recommend: typeof recommend;
  seed: typeof seed;
  users: typeof users;
  "_lib/matchScore": typeof _lib_matchScore;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
