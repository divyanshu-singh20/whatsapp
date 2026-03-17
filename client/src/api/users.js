import axios from 'axios';

const API_URL = 'https://whatsapp-oymf.onrender.com/api/users';

export const getUsers = async (search = '') => {
  const params = search ? { search } : {};
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const getUser = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateUser = async (userData) => {
  const response = await axios.put(`${API_URL}/profile`, userData);
  return response.data;
};