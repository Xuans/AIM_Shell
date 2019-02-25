/**
 * 方案一
 * 生成的文件为
 * -dist
 * 	- img
 * 	- index
 * 		- index.js
 * 		- index.css
 * 		- index.html
 * 	- page1
 * 		- index.js
 * 		- index.css
 * 		- index.html
 * 	- page2
 * 		- index.js
 * 		- index.css
 * 		- index.html
 */
const path = require("path");
const glob = require("glob");
const fs = require("fs");

const config = {
  entry: "main.js",
  html: "index.html",
  pattern: [
    //大连 POC
    "src/pages/dlPoc/*"
  ]
};

const genPages = () => {
  const pages = {};
  const pageEntries = config.pattern.map(e => {
    const matches = glob.sync(path.resolve(__dirname, e));
    return matches.filter(match => fs.existsSync(`${match}/${config.entry}`));
  });
  Array.prototype.concat.apply([], pageEntries).forEach(dir => {
    const filename = dir.split('pages/')[1];
    const pathName = 'src' + dir.split('src')[1]
    pages[filename] = {
      entry: `${pathName}/${config.entry}`,
      template: `${pathName}/${config.html}`,
      filename: `pages/${filename}/${config.html}`,
    };
  });
  return pages;
};

const pages = genPages();
module.exports = {
  productionSourceMap: false,
  pages,
  chainWebpack: config => {
    Object.keys(pages).forEach(entryName => {
      config.plugins.delete(`prefetch-${entryName}`);
    });
    if (process.env.NODE_ENV === "production") {
      config.plugin("extract-css").tap(() => [
        // {
        //   filename: "[name]/css/[name].[contenthash:8].css",
        //   chunkFilename: "[name]/css/[name].[contenthash:8].css"
        // }
        {
          filename: "pages/[name]/style.css",
          chunkFilename: "[name]/css/[name].css"
        }
      ]);
    }
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.output = {
        libraryTarget:'umd',
        //filenameHashing:false,
        path: path.join(__dirname, "./dist"),
        // filename: "[name]/js/[name].[contenthash:8].js",
        filename: "pages/[name]/script.js",
        publicPath: "/",
        // chunkFilename: "[name]/js/[name].[contenthash:8].js"
        chunkFilename: "[name]/js/[name].js"
      };
    }
  }
};
