import axios from 'axios';
import toast from 'react-hot-toast';

const getToken = () => localStorage.getItem ('token');
const getTokenExpiration = () => localStorage.getItem ('tokenExpiration');

const isTokenExpired = () => {
  const expiration = getTokenExpiration ();
  if (!expiration) return true;
  return Date.now () > expiration;
};

const customFetch = axios.create ({
  baseURL: 'https://convrse-task-backend.onrender.com',
});

customFetch.interceptors.request.use (
  config => {
    const token = getToken ();

    if (token) {
      if (isTokenExpired ()) {
        localStorage.clear ();
        toast.error ('Session expired. Please log in again.');
        window.location.href = '/login';
        return Promise.reject (new Error ('Token expired'));
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject (error)
);

export default customFetch;
