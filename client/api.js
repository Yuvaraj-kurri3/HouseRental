const development= "http://localhost:3000";
const production = "https://rentapp-2s3s.onrender.com";

const api = process.env.NODE_ENV === "production" ? production : development;

export default api;