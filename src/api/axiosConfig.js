import axios from 'axios';
//'https://vax-barangay-be.onrender.com/'
//'http://localhost:8080/'
// https://backend-bioflytoffice-402579879370.asia-east1.run.app/
const axiosInstance = axios.create({
  baseURL: 'https://backend-bioflytoffice-402579879370.asia-east1.run.app/', // Replace with your actual backend URL
});

export default axiosInstance;