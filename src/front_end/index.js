import { parseHTML } from "./html_parse.js";
import { query } from "./util.js";
import { makeMap, isValidHttpUrl } from "../shared/index.js";

const btn = query("#b-btn");
const input = query("#b-input");
const container = query("#b-container");

btn.addEventListener("click", async (val) => {
  const url = input.value;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div id="container">
      <!-- <button>按钮</button> -->
      <div class="box1">
          <p>box1 box1 box1</p>
          <p>box1 box1 box1</p>
          <p>box1 box1 box1</p>
      </div>
      <div class="box2">
          <p>box2 box2 box2</p>
      </div>
    </div>
  </body>
  </html>
  `;

  console.log(parseHTML(html));
  // if (isValidHttpUrl(url)) {
  //   console.log({ url });
  //   const html = await  Gluon.ipc.downloadHTML(url)

  //   console.log(html)
  // }
});
