export class Config {
  private static _instance: Config;
  private _idIdentifier: string = "unknown";
  private _requestIdTypeName: string = "requestId";
  private _traceIdTypeName: string = "traceId";

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

  public set requestIdTypeName(requestIdTypeName: string) {
    this._requestIdTypeName = requestIdTypeName;
  }

  public get requestIdTypeName(): string {
    return this._requestIdTypeName;
  }

  public set traceIdTypeName(traceIdTypeName: string) {
    this._traceIdTypeName = traceIdTypeName;
  }

  public get traceIdTypeName(): string {
    return this._traceIdTypeName;
  }
}
