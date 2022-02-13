class ApiError extends Error {

  public code: number;
  public description: string;

  public constructor(_props:{
    message: string,
    code: number,
    description: string,
  }) {
    super(_props.message);
    this.code = _props.code;
    this.description = _props.description;
  }

}

export {
  ApiError,
}
