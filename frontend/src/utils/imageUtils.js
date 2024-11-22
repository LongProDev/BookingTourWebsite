import { BASE_URL } from './config.js';

const getImageUrl = (imagePath) => {
  if (!imagePath) return "/placeholder.jpg";
  
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  
  // Remove any double slashes except after http/https
  return `${BASE_URL}/images${imagePath}`.replace(/([^:]\/)\/+/g, "$1");
};

export default getImageUrl; 