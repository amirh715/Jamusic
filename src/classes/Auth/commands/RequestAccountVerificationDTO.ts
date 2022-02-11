class RequestAccountVerificationDTO {
  
  public mobile: string;

  public constructor(_props: {
    mobile: string,
  }) {
    this.mobile = _props.mobile;
  }

}

export {
  RequestAccountVerificationDTO
}