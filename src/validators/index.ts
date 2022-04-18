import { isPossiblePhoneNumber } from 'libphonenumber-js';
import { email } from '@vuelidate/validators';
import { isNumber } from 'lodash';

const User = {
  name: (value: string) => value.length > 1 && value.length < 80,
  mobile: (value: string) => isPossiblePhoneNumber(value, 'IR'),
  password: (value: string) => value.length > 7 && value.length < 150,
  email,
  passwordResetCode: (value: number) => value > 1110 && value < 10000,
  accountVerificationCode: (value: string) => {
    const code = Number.parseInt(value);
    return code > 999 && code < 10000;
  },
};

const Playlist = {
  title: (value: string) => value.length > 0 && value.length < 80,
  trackIds: (value: string[]) => value.length >= 0 && value.length <= 150,
};

const Report = {
  type: (value: string) => value === 'CONTENT' || value === 'TECHNICAL',
  message: (value: string) => value.length > 9 && value.length < 401,
};

export {
  User,
  Playlist,
  Report,
}
