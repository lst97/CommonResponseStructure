import Joi from "joi";
import { Config } from "../Response.config";

class ErrorMessages {
  static readonly invalidMessageCode = "Invalid message code";
  static readonly invalidRequestId = "Invalid request id";
  static readonly invalidTraceId = "Invalid trace id";
  static readonly invalidVersion = "Invalid version";
}

// Regex related
class DefaultRegex {
  static readonly uuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  static readonly code = /^[A-Z]+(_[A-Z]+)*$/; // VALID_MESSAGE_CODE_EXAMPLE

  // 123.123.123 is valid
  // 001.123.123 is invalid
  // 1.1 is invalid
  // 0.1.1 is invalid
  static readonly version = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
}

const validateMessageCode = (code: string): boolean => {
  if (code.length === 0) {
    return false;
  }

  const pattern = DefaultRegex.code;

  if (!pattern.test(code)) {
    return false;
  }

  return true;
};

const validateUuid = (uuid: string) => {
  const pattern = DefaultRegex.uuid;
  return pattern.test(uuid);
};

const validateVersion = (version: string) => {
  const pattern = DefaultRegex.version;
  return pattern.test(version);
};

// Schemas
const messageSchema = Joi.object({
  code: Joi.string()
    .custom((value, helpers) => {
      if (!validateMessageCode(value)) {
        return helpers.message({ custom: ErrorMessages.invalidMessageCode });
      }
      return value;
    })
    .required(),
  message: Joi.string().required(),
});

const idSchema = (idType: string, errorMessage: string) =>
  Joi.string().custom((value, helpers) => {
    const [idIdentifier, type, id] = value.split(".");

    if (
      !validateUuid(id) ||
      idIdentifier !== Config.instance.idIdentifier ||
      type !== idType
    ) {
      return helpers.message({ custom: errorMessage });
    }

    return value;
  });

const requestIdSchema = idSchema(
  Config.instance.requestIdTypeName,
  ErrorMessages.invalidRequestId,
);

const traceIdSchema = idSchema(
  Config.instance.traceIdTypeName,
  ErrorMessages.invalidTraceId,
);

const versionSchema = Joi.string().custom((value, helpers) => {
  if (!validateVersion(value)) {
    return helpers.message({ custom: ErrorMessages.invalidVersion });
  }
  return value;
});

const statusSchema = Joi.string().valid("error", "success", "partial");

// Not yet finalized. Just a placeholder
const paginationSchema = Joi.object({
  totalItems: Joi.number().required(),
  currentPage: Joi.number().required(),
  itemsPerPage: Joi.number().required(),
  totalPages: Joi.number().required(),
});

// Not yet finalized. Just a placeholder
const resultSchema = Joi.object({
  data: Joi.any().required(),
  success: Joi.boolean().required(),
  errorMessage: Joi.string().optional(),
});

/**
 * @example
    A class that defines a set of Joi schemas for validating response objects.
    ## Example Usage
    ```typescript
    const response = {
    status: "success",
    message: {
        code: "SUCCESS",
        message: "Success",
    },
    data: { ... },
    requestId: "{idIdentifier}.requestId.{uuid}",
    traceId: "{idIdentifier}.traceId.{uuid}",
    timestamp: "2022-01-01T00:00:00Z",
    warnings: { ... },
    version: "1.0.0",
    pagination: { ... },
    metadata: { ... },
    result: [ ... ],
    };
    const { error, value } = ResponseSchemas.joiSchema.validate(response);
    if (error) {
    console.log("Validation error:", error);
    } else {
    console.log("Validation success:", value);
    }
    ```
    ## Fields
    - `joiSchema`: A Joi schema that defines the validation rules for the response object. It includes validation rules for the status, message, data, requestId, traceId, timestamp, warnings, version, pagination, metadata, and result fields. The validation rules are defined using the Joi library's schema definition methods.
    ## Methods
    - None 
*/
export class ResponseSchemas {
  public static readonly joiSchema = Joi.object({
    status: statusSchema.required(),
    message: messageSchema.required(),
    data: Joi.any(),
    requestId: requestIdSchema.required(),
    traceId: traceIdSchema.optional(),
    timestamp: Joi.string().isoDate().required(),
    warnings: messageSchema.optional(),
    version: versionSchema.required(), // Different versions may have different schemas
    pagination: paginationSchema.optional(), // TODO
    metadata: Joi.object().optional(), // TODO
    result: Joi.array().optional(), // TODO
  })
    .when(".status", {
      is: "partial",
      then: Joi.object({
        result: Joi.array().items(resultSchema).required(),
        traceId: traceIdSchema.required(),
      }),
    })
    .when(".status", {
      is: "error",
      then: Joi.object({
        traceId: traceIdSchema.required(),
      }),
    })
    .when(".status", {
      is: Joi.valid("success"),
      then: Joi.object({
        traceId: Joi.forbidden(), // traceId is not allowed
      }),
    })
    .unknown(false); // Disallow unknown fields

  // Other schemas framework
}
