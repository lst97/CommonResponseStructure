/**
 * Configuration class for managing application settings using a singleton pattern.
 *
 * This class provides access to configuration properties such as ID identifier, request ID name, and trace ID name.
 *
 * Then the `ResponseSchemas` class will use these properties to generate the appropriate schemas for request and trace IDs.
 *
 * @example
 * "{_idIdentifier}.{_requestIdName}.22680f70-2f03-46c7-b230-14f4babbfbda"
 */
export class Config {
  private static _instance: Config;
  private _idIdentifier: string = "unknown";
  private _requestIdName: string = "requestId";
  private _traceIdName: string = "traceId";

  private constructor() {}

  public static get instance(): Config {
    if (!this._instance) {
      this._instance = new Config();
    }
    return this._instance;
  }

  public set idIdentifier(idIdentifier: string) {
    this._idIdentifier = idIdentifier;
  }

  public get idIdentifier(): string {
    return this._idIdentifier;
  }

  public set requestIdName(requestIdName: string) {
    this._requestIdName = requestIdName;
  }

  public get requestIdName(): string {
    return this._requestIdName;
  }

  public set traceIdName(traceIdName: string) {
    this._traceIdName = traceIdName;
  }

  public get traceIdName(): string {
    return this._traceIdName;
  }
}
