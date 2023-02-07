import * as Gluon from "@gluon-framework/gluon";
import { downloadHTML} from './src/serve/download.js'


async function _main() {
  const browsers = process.argv.slice(2).filter((x) => !x.startsWith("-"));

  if (browsers.length > 0) {
    // use argv as browsers to use
    for (const forceBrowser of browsers) {
      await Gluon.open("index.html", {
        windowSize: [800, 500],
        forceBrowser,
      });
    }

    return;
  }

  const win = await Gluon.open("index.html", {
    windowSize: [800, 500],
  });

  // 绑定 与后端通信方法
  win.ipc.downloadHTML = downloadHTML
}

_main();
