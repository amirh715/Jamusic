import * as _ from 'lodash';
import { HttpService } from '../HttpService';
import { EditProfileDTO } from '@/classes/Profile/commands/EditProfileDTO';
import { ProfileDetails } from '@/classes/Profile/query/ProfileDetails';
import { AuthService } from '../AuthService';
import { ApiError } from '../HttpService/ApiError';

class ProfileService {

  public async getMyProfile(): Promise<ProfileDetails> {
    try {
      const { data } = await HttpService.get(`/user/myprofile/`);
      return Promise.resolve(new ProfileDetails(data));
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async editMyProfile(dto: EditProfileDTO): Promise<void> {
    try {
      const {
        name,
        email,
        profileImage,
        removeProfileImage,
      } = dto;
      const data = new FormData();
      data.append('id', AuthService.getSubjectId());
      if(name) {
        data.append('name', name);
      }
      if(!_.isNil(email)) {
        data.append('email', email);
      }
      if(profileImage) {
        data.append('profileImage', profileImage);
      }
      if(!_.isNil(removeProfileImage)) {
        data.append('removeProfileImage', _.toString(removeProfileImage));
      }
      await HttpService.put('/user/', data);
      return Promise.resolve();
    } catch(err) {
      return Promise.reject(err);
    }
  }

  public async getMyProfileImage(): Promise<Blob> {
    try {
      const { data } = await HttpService.get('/user/myprofile-image/', '', { responseType: 'blob' });
      return Promise.resolve(new Blob([data]));
    } catch(err) {
      return Promise.reject(err);
    }
  }

}

const INSTANCE = new ProfileService();

export {
  INSTANCE as ProfileService,
}
