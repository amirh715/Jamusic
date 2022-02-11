class ProfileDetails {

  public id: string;
  public name: string;
  public mobile: string;
  public email: string;
  public isEmailVerified: boolean;

  public constructor(_props: {
    id: string,
    name: string,
    mobile: string,
    email: string,
    isEmailVerified: boolean,
  }) {
    this.id = _props.id;
    this.name = _props.name;
    this.mobile = _props.mobile;
    this.email = _props.email;
    this.isEmailVerified = _props.isEmailVerified;
  }

}

export {
  ProfileDetails,
}
