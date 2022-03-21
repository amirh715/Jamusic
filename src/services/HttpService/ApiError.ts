class ApiError extends Error {

  public type: string;
  public code: number;
  public description: string;
  public httpStatusCode: number;

  public constructor(_props:{
    type: string,
    message: string,
    code: number,
    description: string,
    httpStatusCode: number,
  }) {
    super(_props.message);
    this.type = _props.type;
    this.code = _props.code;
    this.description = _props.description;
    this.httpStatusCode = _props.httpStatusCode;
  }

}

export {
  ApiError,
}
