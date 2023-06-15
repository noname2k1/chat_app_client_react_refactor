import axios from 'axios';
const token = window.localStorage.getItem('token');
export const withTokenInstance = axios.create();

if (token) {
  withTokenInstance.defaults.headers.authorization = 'Bearer ' + token;
} else {
  delete withTokenInstance.defaults.headers.authorization;
}
