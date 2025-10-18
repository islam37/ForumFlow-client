import axios from "axios";

const Axios = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

export default Axios;



//https://forum-flow-server.vercel.app/api