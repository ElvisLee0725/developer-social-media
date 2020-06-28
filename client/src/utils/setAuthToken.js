import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    // Set this token to the header 'x-auth-token'
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    // Delete this header field if there is no token
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
