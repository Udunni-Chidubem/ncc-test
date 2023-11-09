const responseCodes = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INVALID_REQUEST: 400,
  FORBIDDEN: 403,
  TIMEOUT: 403,
  EXCEPTION: 500,
};
const responseMessages = {
  SUCCESS: "SUCCESSFUL",
  UNAUTHORIZED: "UNAUTHORIZED",
  NOT_FOUND: "Not Found",
  INVALID_REQUEST: "INVALID REQUEST",
  FORBIDDEN: "FORBIDDEN",
  TIMEOUT: "GATEWAY TIMEOUT",
  EXCEPTION: "INTERNAL SERVER ERROR",
};
module.exports = {
  success: (message) => {
    return {
      code: responseCodes["SUCCESS"],
      message: responseMessages["SUCCESS"],
      body: message,
    };
  },
  unauthorized: (message) => {
    return {
      code: responseCodes["UNAUTHORIZED"],
      message: responseMessages["UNAUTHORIZED"],
      body: message,
    };
  },
  badRequest: (message) => {
    return {
      code: responseCodes["INVALID_REQUEST"],
      message: responseMessages["INVALID_REQUEST"],
      body: message,
    };
  },
  notFound: (message) => {
    return {
      code: responseCodes["INVALID_REQUEST"],
      message: responseMessages["INVALID_REQUEST"],
      body: message,
    };
  },
  exception: (message) => {
    return {
      code: responseCodes["EXCEPTION"],
      message: responseMessages["EXCEPTION"],
      body: message,
    };
  },
};
