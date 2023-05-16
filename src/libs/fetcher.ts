import axios from "axios";

const fetcher = (url: string, body?: any) => {
  return axios.get(url, { data: body }).then((res) => res.data);
};

export default fetcher;