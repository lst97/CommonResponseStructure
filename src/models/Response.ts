/**
 * Represents a message for a response.
 * @property {string} code The code of the warning, should be the format like `EXAMPLE_CODE`. Check the schemas for details.
 * @property {string} message The human readable message of the warning.
 */
export interface IMessage {
  code: string;
  message: string;
}

/**
 * Represents a warning for a response.
 *
 * @interface IMessage
 */
export class ResponseWarning implements IMessage {
  code: string;
  message: string;

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }
}

/**
 * Represents a message for a response either error | success | partial in the status.
 *
 * @interface IMessage
 */
export class ResponseMessage implements IMessage {
  public code: string;
  public message: string;

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }
}

/**
 * Represents pagination information for a paginated response.
 *
 * @property {number} totalItems - The total number of items available across all pages.
 * @property {number} currentPage - The current page number being viewed (starting from 1).
 * @property {number} itemsPerPage - The number of items displayed on each page.
 * @property {number} totalPages - The total number of pages available based on the total items and items per page.
 *
 * @example 
 * const myPagination: Pagination = {
    totalItems: 100,
    currentPage: 2,
    itemsPerPage: 10,
    totalPages: 10,
  };
 */
export interface IPagination {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

export interface IMetaData {}
export class Metadata implements IMetaData {
  // Add any relevant metadata properties here
}

/**
 * Represents the result of an operation, containing data, success status, and optional error message.
 *
 * @template T - The type of data contained within the result.
 *
 * @property {T} data - The data payload of the result.
 * @property {boolean} success - Indicates whether the operation was successful (true) or not (false).
 * @property {string} [errorMessage] - An optional error message describing the reason for failure, present only when `success` is false.
 */
export interface IResult<T> {
  data: T;
  success: boolean;
  errorMessage?: string;
}

// For partial success
export class Result<T> implements IResult<T> {
  data: T;
  success: boolean;
  errorMessage?: string;

  constructor(data: T, success: boolean, errorMessage?: string) {
    this.data = data;
    this.success = success;
    this.errorMessage = errorMessage;
  }
}

export type ResponseStatusTypes = "success" | "error" | "partial";

/**
 * Interface for the standardized backend response structure.
 *
 * This interface defines the properties that should be included in any response
 * returned by the backend API, ensuring consistency and providing valuable
 * information to the client.
 *
 * @typeParam T - The type of the data payload included in the response.
 *
 * @property {StatusTypes} status - Indicates the overall status of the request.
 *   Possible values: "success", "error", "partial".
 * @property {IMessage} message - A message providing details about the response,
 *   including any errors or informational messages.
 * @property {T} [data] - The primary data payload of the response. The type of
 *   this property is determined by the `T` type parameter.
 * @property {string} requestId - A unique identifier for the request, useful for
 *   tracking and debugging purposes.
 * @property {string} [traceId] - An optional trace ID for distributed tracing,
 *   allowing you to track the request across multiple services.
 * @property {string} [timestamp] - An ISO 8601 formatted timestamp indicating
 *   when the response was generated.
 * @property {IMessage[]} [warnings] - An array of warning messages, providing
 *   additional information about potential issues.
 * @property {string} [version] - The version of the API that generated the
 *   response. Defaults to "1.0.0".
 * @property {IPagination} [pagination] - Pagination information for responses
 *   that return a list of items.
 * @property {Metadata} [metadata] - Additional metadata about the response,
 *   specific to the API endpoint.
 * @property {Result<T>[]} [result] - An array of Result objects containing data.
 *   This is an additional field used for partial success
 * 
 * @example
 * 
 * {
      status: "success",
      message: {
        code: "SUCCESS",
        message: "Success",
      },
      data: null,
      requestId: "test.requestId.22680f70-2f03-46c7-b230-14f4babbfbda",
      timestamp: "2022-01-01T00:00:00Z",
      warnings: {
        code: "TEST",
        message: "This is a test.",
      },
      metadata: { test: "test" },
      pagination: {
        totalItems: 1,
        currentPage: 1,
        itemsPerPage: 1,
        totalPages: 1,
      },
      version: "1.0.0",
    };
 */
export interface IBackendStandardResponseInput<T> {
  status: ResponseStatusTypes;
  message: IMessage;
  data?: T;
  requestId: string;
  traceId?: string;
  timestamp?: string; // ISO 8601 format
  warnings?: IMessage[];
  version?: string;
  pagination?: IPagination;
  metadata?: Metadata;
  result?: Result<T>[];
}

export class BackendStandardResponse<T>
  implements IBackendStandardResponseInput<T>
{
  status: ResponseStatusTypes;
  message: IMessage;
  data?: T;
  requestId: string;
  traceId?: string;
  timestamp?: string;
  warnings?: IMessage[];
  version?: string;
  pagination?: IPagination;
  metadata?: Metadata;
  result?: Result<T>[]; // List of Result<T>

  constructor(input: IBackendStandardResponseInput<T>) {
    this.status = input.status;
    this.message = input.message;
    this.data = input.data;
    this.requestId = input.requestId;
    this.traceId = input.traceId;
    this.timestamp = input.timestamp || new Date().toISOString();
    this.warnings = input.warnings;
    this.version = input.version || "1.0";
    this.pagination = input.pagination;
    this.metadata = input.metadata;
    this.result = input.result;
  }
}
