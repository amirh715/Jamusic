class VerifyAccountDTO {
  
  public mobile: string;
  public code: string;

  public constructor(_props: {
    mobile: string,
    code: string
  }) {
    this.mobile = _props.mobile;
    this.code = _props.code;
  }

}

export {
  VerifyAccountDTO
}
