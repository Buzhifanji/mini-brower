import { Webview } from "webview";
import { isURL } from "is_url";

const html = `
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>mini brower</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="h-full w-full">
    <main  class="h-full w-full p-5">
      <div>
        <input id="b-input" class="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-5/6 text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm" type="text" aria-label="Filter projects" placeholder="请输入URL地址">
        <button id="b-btn" class="ml-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">开始</button>
      </div>
      <section id="b-app" class="mt-[20px]">
      </section>
    </main>
  </body>
  <script>
    const query = val => document.querySelector(val);
    const btn = query('#b-btn');
    const input = query('#b-input');

    btn.addEventListener('click', () => {
      btnClick(input.value)
    })
  </script>
  </html>
`;

const webview = new Webview();

webview.title = "mini browser";
webview.navigate(`data:text/html,${encodeURIComponent(html)}`);

webview.bind("btnClick", (value: string) => {
  if (isURL(value)) {
    console.log({ value });
  } else {
    console.log('err')
  }
});

webview.run();
