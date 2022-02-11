class RequestEmailVerificationDTO {

  public userId: string;

  public constructor(_props: {
    userId: string,
  }) {
    this.userId = _props.userId;
  }

}

export {
  RequestEmailVerificationDTO
}
