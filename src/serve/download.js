import axios from "axios";

export function downloadHTML(url) {
  return axios(url)
    .then((value) => value.data)
    .catch((err) => {
      console.log(err);
      return "";
    });
}
