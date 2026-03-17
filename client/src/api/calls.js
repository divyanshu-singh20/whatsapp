import axios from 'axios';

const API_URL = 'https://whatsapp-oymf.onrender.com/api/calls';

export const createCall = async (callData) => {
  const response = await axios.post(API_URL, callData);
  return response.data;
};

export const getCalls = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};