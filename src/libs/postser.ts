import axios from "axios";

const postser = (url: string, body?: any) => {
  return axios.post(url, body).then((res) => res.data);
};

export default postser;
