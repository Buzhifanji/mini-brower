import { isUnaryTag } from "./util.js";

const startTagOpenReg = /^<([a-zA-Z0-9\-]+)(?:([ ]+[a-zA-Z0-9\-]+=[^> ]+))*>/; //  开始标签, 以 < 开头
const startTagCloseReg = /^\s*(\/?)>/; // 开始标签 的结束位置， 以 > 或者 /> 结尾

const endTagReg = /^<\/([a-zA-Z0-9\-]+)>/; // 结束标签, 以  </ 开头
const attributeReg =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 属性

const commentReg = /^<!\-\-[^(-->)]*\-\->/; // 注释标签
const docTypeReg = /^<*(!doctype|!DOCTYPE) [^>]+>/; // doctype 标签

/**
 * 利用正则去匹配标签，方便理解
 * @param {*} html
 */
function parse(html, options) {
  function advance(num) {
    html = html.slice(num);
  }

  function parseComment(match) {
    options.comment({
      type: "comment",
      value: match[0],
    });
    advance(match[0].length);
  }

  function parseDocType(match) {
    options.docType({
      type: "doctype",
      value: match[0],
    });
    advance(match[0].length);
  }

  function parseStartTag(match) {
    const tagName = match[1];
    const tag = {
      type: "startTag",
      value: tagName,
      attributes: [],
      unary: isUnaryTag(tagName) || false, // 表示标签是否自闭合
    };

    // <div id="container"> => id="container">
    advance(match[1].length + 1);

    // 匹配属性
    let attributeMatch;
    while ((attributeMatch = html.match(attributeReg))) {
      const [name, attr] = attributeMatch[0].split("=");
      const value = attr
        ? attr.replace(/^['"]/, "").replace(/['"]$/, "")
        : null;

      tag.attributes.push({ name, value });

      advance(attributeMatch[0].length);
    }

    const end = html.match(startTagCloseReg);
    if (end) {
      // 删除 最后的 > 获取 />
      advance(end[0].length);
    }

    options.startTag(tag);
  }

  function parseEndTag(match) {
    options.endTag({
      type: "endTag",
      value: match[1],
    });
    advance(match[0].length);
  }

  function parseText() {
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

  while (html) {
    if (html.startsWith("<")) {
      // 匹配 <!-- （注释标签）
      const commentMatch = html.match(commentReg);
      if (commentMatch) {
        parseComment(commentMatch);
        continue;
      }

      // 匹配 docType 标签
      const docTypeMatch = html.match(docTypeReg);
      if (docTypeMatch) {
        parseDocType(docTypeMatch);
        continue;
      }

      // 匹配 结束标签
      const endTagMatch = html.match(endTagReg);
      if (endTagMatch) {
        parseEndTag(endTagMatch);
        continue;
      }

      // 匹配 开始标签
      const startTagMatch = html.match(startTagOpenReg);
      if (startTagMatch) {
        parseStartTag(startTagMatch);
        continue;
      }
    } else {
      // 处理 text 文本
      parseText();
    }
  }
}

export function parseHTML(str) {
  const ast = {
    children: [],
  };
  let curParent = ast;
  const stack = [];
  const stackIsEmpty = () => stack.length === 0;

  const parseOption = {
    comment({ type, value }) {},
    docType({ type, value }) {
      curParent.children.push({
        type,
        value,
      });
    },
    text({ value }) {
      curParent.text = value;
    },
    startTag({ type, value, unary, attributes }) {
      const tag = {
        type,
        tageName: value,
        attributes,
        text: "",
        children: [],
      };
      curParent.children.push(tag);
      if (!unary) {
        // 不是 自闭合标签
        curParent = tag;
        stack.push(tag);
      }
    },
    endTag({ type, value }) {
      if (stackIsEmpty()) return;
      stack.pop();

      if (!stackIsEmpty()) {
        curParent = stack[stack.length - 1];
      }
    },
  };

  parse(str, parseOption);

  return ast;
}
