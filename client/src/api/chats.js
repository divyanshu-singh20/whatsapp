import axios from 'axios';

const API_URL = 'https://whatsapp-oymf.onrender.com/api/chats';

export const getChats = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createChat = async (senderId, receiverId) => {
  const response = await axios.post(API_URL, { senderId, receiverId });
  return response.data;
};