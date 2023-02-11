import { makeMap } from "../shared/index.js";

/**
 * 自闭合标签
 */
export const isUnaryTag = makeMap(
  "area,base,br,col,embed,frame,hr,img,input,isindex,keygen," +
    "link,meta,param,source,track,wbr"
);

export const query = (val) => document.querySelector(val);
