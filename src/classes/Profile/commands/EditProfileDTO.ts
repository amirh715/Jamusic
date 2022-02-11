class EditProfileDTO {

  public name: string;
  public email: string;
  public removeProfileImage: boolean;

  public constructor(_props: {
    name: string,
    email: string,
    removeProfileImage: boolean,
  }) {
    this.name = _props.name;
    this.email = _props.email;
    this.removeProfileImage = _props.removeProfileImage;
  }

}

export {
  EditProfileDTO,
}
