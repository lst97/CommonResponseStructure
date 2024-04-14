import { Config } from "../Response.config";
import { ResponseSchemas } from "../schemas/ResponseSchemas";

// Basic Schema tests
describe("ResponseSchemas", () => {
  let validResponseStructure: {
    status?: string;
    message?: { code: string; message: string };
    data?: any;
    requestId?: string;
    traceId?: string;
    timestamp?: string;
    warnings?: any;
    version?: string;
    pagination?: any;
    metadata?: any;
    result?: any[];
    [key: string]: any; // Index signature for testing
  };

  beforeEach(() => {
    Config.instance.idIdentifier = "test";
    Config.instance.requestIdTypeName = "requestId";
    Config.instance.traceIdTypeName = "traceId";

    validResponseStructure = {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should validate a response object with all required fields and valid data types", () => {
    const response = validResponseStructure;

    const result = ResponseSchemas.joiSchema.validate(response);
    expect(result.error).toBeUndefined();
  });

  it("should not validate a response object without a status field", () => {
    const response = validResponseStructure;
    response.status = undefined;

    const result = ResponseSchemas.joiSchema.validate(response);
    expect(result.error).toBeDefined();
  });

  it('should validate a response object with a status of "partial"', () => {
    const response = validResponseStructure;
    response.status = "partial";

    const result = ResponseSchemas.joiSchema.validate(response);
    expect(result.error).toBeDefined();
  });

  it('should validate a response object with a valid result array for "partial" status', () => {
    const response = validResponseStructure;
    response.status = "partial";
    response.traceId = "test.traceId.22680f70-2f03-46c7-b230-14f4babbfbda";

    // missing result
    let result = ResponseSchemas.joiSchema.validate(response);
    expect(result.error).toBeDefined();

    response.result = [
      {
        data: {
          id: "1",
          name: "test.jpg",
        },
        success: false,
        errorMessage: "Test - invalid format",
      },
      {
        data: {
          id: "2",
          name: "test.png",
        },
        success: true,
      },
    ];

    result = ResponseSchemas.joiSchema.validate(response);
    expect(result.error).toBeUndefined();
  });

  it('should validate a response object with a valid traceId for "error" status', () => {
    const response = validResponseStructure;
    response.status = "error";

    // missing traceId
    let result = ResponseSchemas.joiSchema.validate(response);
    expect(result.error).toBeDefined();

    response.traceId = "test.traceId.22680f70-2f03-46c7-b230-14f4babbfbda";

    result = ResponseSchemas.joiSchema.validate(response);
    expect(result.error).toBeUndefined();
  });

  // testing for id validation
  it('should not validate a response object with an invalid traceId for "error" status', () => {
    const response = validResponseStructure;
    response.status = "error";

    response.traceId = "invalid.traceId.22680f70-2f03-46c7-b230-14f4b*bbfbda";
    let result = ResponseSchemas.joiSchema.validate(response);
    expect(result.error).toBeDefined();

    response.traceId = "invalid.traceId.22680f70-2f03-46c7-b230-14f4bbBfbda";
    result = ResponseSchemas.joiSchema.validate(response);
    expect(result.error).toBeDefined();

    response.traceId = "invalid.traceId";
    result = ResponseSchemas.joiSchema.validate(response);
    expect(result.error).toBeDefined();
  });

  it("should not validate a response object with an additional field instead of the status field", () => {
    let response = validResponseStructure as any;
    response.test = "This is a additional test field";

    const result = ResponseSchemas.joiSchema.validate(response);

    expect(result.error).toBeDefined();
    expect(result.error!.details[0].message).toContain("is not allowed");
  });

  it("should not validate a response object with an invalid pagination object", () => {
    let response = validResponseStructure;
    response.pagination = "invalidate pagination";

    const result = ResponseSchemas.joiSchema.validate(response);

    expect(result.error).toBeDefined();
    expect(result.error!.details[0].message).toContain("pagination");
  });

  it("should not validate a response object with an invalid warnings object", () => {
    const response = validResponseStructure;
    response.warnings = "invalid warnings";

    const result = ResponseSchemas.joiSchema.validate(response);

    expect(result.error).toBeDefined();
    expect(result.error!.details[0].message).toContain("warnings");
  });
});
