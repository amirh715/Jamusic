import { dataURItoBlob } from "@/utils/DataURIToBlob";

class EditProfileDTO {

  public name?: string;
  public email?: string;
  public profileImage?: Blob;
  public removeProfileImage?: boolean;

  public constructor(_props: {
    name?: string,
    email?: string,
    profileImage?: string,
    removeProfileImage?: boolean,
  }) {
    this.name = _props.name;
    this.email = _props.email;
    this.profileImage = _props.profileImage && dataURItoBlob(_props.profileImage);
    this.removeProfileImage = _props.removeProfileImage;
  }

}

export {
  EditProfileDTO,
}
