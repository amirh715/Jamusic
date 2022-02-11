class ResetPasswordDTO {

  public mobile: string;
  public code: string;
  public newPassword: string;

  public constructor(_props: {
    mobile: string,
    code: string,
    newPassword: string,
  }) {
    this.mobile = _props.mobile;
    this.code = _props.code;
    this.newPassword = _props.newPassword;
  }

}

export {
  ResetPasswordDTO
}
