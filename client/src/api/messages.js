import axios from 'axios';

const API_URL = 'https://whatsapp-oymf.onrender.com/api/messages';

export const getMessages = async (chatId) => {
  const response = await axios.get(`${API_URL}/${chatId}`);
  return response.data;
};

export const sendMessage = async (chatId, text) => {
  const response = await axios.post(`${API_URL}/${chatId}`, { text });
  return response.data;
};

export const markAsSeen = async (chatId) => {
  const response = await axios.put(`${API_URL}/${chatId}/seen`);
  return response.data;
};