import axios from "axios";

const Axios = axios.create({
  baseURL: "https://forum-flow-server.vercel.app/api",
  headers: { "Content-Type": "application/json" },
});

export default Axios;
