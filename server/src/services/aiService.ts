import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000/analyze';

export const analyzeImage = async (filePath: string) => {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath), path.basename(filePath));

  try {
    const response = await axios.post(AI_SERVICE_URL, form, {
      headers: {
        ...form.getHeaders()
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error communicating with AI service:", error);
    throw new Error("AI Service failed to analyze the image.");
  }
};
