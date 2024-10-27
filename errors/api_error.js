class ApiError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
  static Badrequest(message) {
    return new ApiError(400, message);
  }
  static Forbidden(message) {
    return new ApiError(403, message);
  }
  static unauthorized(message) {
    return new ApiError(401, message);
  }
  static internalServer(message) {
    return new ApiError(500, message);
  }
}

export default ApiError;
