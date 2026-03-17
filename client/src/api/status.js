import axios from 'axios';

const API_URL = 'https://whatsapp-oymf.onrender.com/api/status';

export const createStatus = async (statusData) => {
  const response = await axios.post(API_URL, statusData);
  return response.data;
};

export const getStatuses = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};