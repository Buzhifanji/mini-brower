import { parseHTML } from "./html_parse.js";

const query = (val) => document.querySelector(val);

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

const btn = query("#b-btn");
const input = query("#b-input");
const container = query("#b-container");

btn.addEventListener("click", async (val) => {
  const url = input.value;

  const html = `
  <!doctype html>
  <body>
      <div>
          <!--button-->
          <button>按钮</button>
          <div id="container">
              <div class="box1">
                  <p>box1 box1 box1</p>
              </div>
              <div class="box2">
                  <p>box2 box2 box2</p>
              </div>
          </div>
      </div>
  </body>
  `;

  console.log(parseHTML(html));
  // if (isValidHttpUrl(url)) {
  //   console.log({ url });
  //   const html = await  Gluon.ipc.downloadHTML(url)

  //   console.log(html)
  // }
});
