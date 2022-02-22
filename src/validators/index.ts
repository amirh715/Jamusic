import { isPossiblePhoneNumber } from 'libphonenumber-js';

const User = {
  name: (value: string) => value.length > 1 && value.length < 80,
  mobile: (value: string) => isPossiblePhoneNumber(value, 'IR'),
  password: (value: string) => value.length > 7 && value.length < 150,
};

const Playlist = {
  title: (value: string) => value.length > 0 && value.length < 80,
  trackIds: (value: string[]) => value.length >= 0 && value.length <= 150,
};

const Report = {
  type: (value: string) => value === 'CONTENT' || value === 'TECHNICAL',
  message: (value: string) => value.length > 20 && value.length < 400,
};

export {
  User,
  Playlist,
  Report,
}
