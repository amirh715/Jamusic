class ChangePasswordRequestDTO {

  public currentPassword: string;
  public newPassword: string;

  public constructor(_props: {
    currentPassword: string,
    newPassword: string,
  }) {
    this.currentPassword = _props.currentPassword;
    this.newPassword = _props.newPassword;
  }

}

export {
  ChangePasswordRequestDTO,
}
