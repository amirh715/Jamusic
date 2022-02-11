class LoginRequestDTO {

  public mobile: string;
  public password: string;

  public constructor(_props: {
    mobile: string,
    password: string,
  }) {
    this.mobile = _props.mobile;
    this.password = _props.password;
  }

}

export {
  LoginRequestDTO,
}
