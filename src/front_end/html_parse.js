const startTagReg = /^<([a-zA-Z0-9\-]+)(?:([ ]+[a-zA-Z0-9\-]+=[^> ]+))*>/; //  开始标签, 以 < 开头
const endTagReg = /^<\/([a-zA-Z0-9\-]+)>/; // 结束标签, 以  </ 开头
const attributeReg =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 属性
const commentReg = /^<!\-\-[^(-->)]*\-\->/; // 注释标签
const docTypeReg = /^<!doctype [^>]+>/; // doctype 标签

/**
 * 利用正则去匹配标签，方便理解
 * @param {*} html
 */
function parse(html, options) {
  function advance(num) {
    html = html.slice(num);
  }

  while (html) {
    if (html.startsWith("<")) {
      // 匹配 <!-- （注释标签）
      const commentMatch = html.match(commentReg);
      if (commentMatch) {
        options.comment({
          type: "comment",
          value: commentMatch[0],
        });
        advance(commentMatch[0].length);
        continue;
      }

      // 匹配 docType 标签
      const docTypeMatch = html.match(docTypeReg);
      if (docTypeMatch) {
        options.docType({
          type: "doctype",
          value: docTypeMatch[0],
        });
        advance(docTypeMatch[0].length);
        continue;
      }

      // 匹配 结束标签
      const endTagMatch = html.match(endTagReg);
      if (endTagMatch) {
        options.endTag({
          type: "endTag",
          value: endTagMatch[1],
        });
        advance(endTagMatch[0].length);
        continue;
      }

      // 匹配 开始标签
      const startTagMatch = html.match(startTagReg);
      if (startTagMatch) {
        options.startTag({
          type: "startTag",
          value: startTagMatch[1],
        });

        // <div id="container"> => id="container">
        advance(startTagMatch[1].length + 1);

        // 匹配属性
        let attributeMatch;
        while ((attributeMatch = html.match(attributeReg))) {
          options.attribute({
            type: "attribute",
            value: attributeMatch[1],
          });
          advance(attributeMatch[0].length);
        }

        // 删除 最后 一个 >
        advance(1);
        continue;
      }
    } else {
      // 处理 text 文本
      let textEndIndex = html.indexOf("<");
      options.text({
        type: "text",
        value: html.slice(0, textEndIndex),
      });

      if (textEndIndex === -1) {
        textEndIndex = html.length;
      }

      advance(textEndIndex);
    }
  }
}

export function parseHTML(str) {
  const ast = {
    children: [],
  };
  let curParent = ast;
  let prevParent = null;

  const parseOption = {
    comment(token) {},
    docType({ type, value }) {},
    text({ value }) {
      curParent.text = value;
    },
    startTag({ type, value }) {
      console.log({ type, value });
      const tag = {
        tageName: value,
        attributes: [],
        text: "",
        children: [],
      };
      curParent.children.push(tag);
      prevParent = curParent;
      curParent = tag;
    },
    endTag({ type, value }) {
      curParent = prevParent;
    },
    attribute({ type, value }) {
      const [name, attr] = value.split("=");
      curParent.attributes.push({
        name,
        value: value.replace(/^['"]/, "").replace(/['"]$/, ""),
      });
    },
  };

  parse(str, parseOption);

  return ast.children[0];
}
