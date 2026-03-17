import axios from 'axios';

const API_URL = 'http://localhost:5000/api/status';

export const createStatus = async (statusData) => {
  const response = await axios.post(API_URL, statusData);
  return response.data;
};

export const getStatuses = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};