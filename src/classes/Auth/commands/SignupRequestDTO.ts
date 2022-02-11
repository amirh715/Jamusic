class SignupRequestDTO {

  public mobile: string;
  public name: string;
  public password: string;

  public constructor(_props: {
    mobile: string,
    name: string,
    password: string,
  }) {
    this.mobile = _props.mobile;
    this.name = _props.name;
    this.password = _props.password;
  }

}

export {
  SignupRequestDTO,
}
