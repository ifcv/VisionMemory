import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getAnalyses = async (page = 1, limit = 10) => {
  const response = await api.get(`/analyses?page=${page}&limit=${limit}`);
  return response.data;
};

export const getMemoryEntries = async () => {
  const response = await api.get('/memory');
  return response.data;
};
