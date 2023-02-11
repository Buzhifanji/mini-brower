import { parseHTML } from "./html_parse.js";
import { query } from "./util.js";
import { makeMap, isValidHttpUrl } from "../shared/index.js";

const btn = query("#b-btn");
const input = query("#b-input");
const container = query("#b-container");

btn.addEventListener("click", async (val) => {
  const url = input.value;

  const html = `
  <div id="container">
    <div class="box1">
        <p>box1 box1 box1</p>
        <p>box1 box1 box1</p>
        <p>box1 box1 box1</p>
    </div>
    <div class="box2">
        <p>box2 box2 box2</p>
    </div>
  </div>
  `;

  console.log(parseHTML(html));
  // if (isValidHttpUrl(url)) {
  //   console.log({ url });
  //   const html = await  Gluon.ipc.downloadHTML(url)

  //   console.log(html)
  // }
});
