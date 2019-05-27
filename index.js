const express = require('express');
const app = express();
const superagent= require('superagent');//superagent （superagent是node里一个非常方便的、轻量的、渐进式的第三方客户端请求代理模块，用他来请求目标页面
const cheerio = require('cheerio');//cheerio相当于node版的jQuery，用过jQuery的同学会非常容易上手。它主要是用来获取抓取到的页面元素和其中的数据信息
// 1. 实例化一个express对象，用它来启动一个本地监听3000端口的Http服务

let server = app.listen(3000, function () {
  let host = server.address().address;
  let port = server.address().port;
  console.log('Your App is running at http://%s:%s', host, port);
});

// 2. 访问本机地址http://localhost:3000的时候（node index.js），返回一个Hello World！
// app.get('/', function (req, res) {
//     res.send('Hello World!');
//   });


//   2、为了爬取新闻数据，首先我们要用superagent请求目标页面，获取整个新闻首页信息
let hotNews = [];                                // 热点新闻
let localNews = [];                              // 本地新闻

/**
 * index.js
 * [description] - 使用superagent.get()方法来访问百度新闻首页
 */
superagent.get('http://news.baidu.com/').end((err, res) => {
  if (err) {
    // 如果访问失败或者出错，会这行这里
    console.log(`热点新闻抓取失败 - ${err}`)
  } else {
   // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res
   // 抓取热点新闻数据
   hotNews = getHotNews(res)
  }
});

// 3、获取页面信息后，我们来定义一个函数getHotNews()来抓取页面内的“热点新闻”数据。
let getHotNews = (res) => {
    let hotNews = [];
    // 访问成功，请求http://news.baidu.com/页面所返回的数据会包含在res.text中。
    
    /* 使用cheerio模块的cherrio.load()方法，将HTMLdocument作为参数传入函数
       以后就可以使用类似jQuery的$(selectior)的方式来获取页面元素
     */
    let $ = cheerio.load(res.text);
  
    // 找到目标数据所在的页面元素，获取数据
    $('div#pane-news ul li a').each((idx, ele) => {
      // cherrio中$('selector').each()用来遍历所有匹配到的DOM元素
      // 参数idx是当前遍历的元素的索引，ele就是当前便利的DOM元素
      let news = {
        title: $(ele).text(),        // 获取新闻标题
        href: $(ele).attr('href')    // 获取新闻网页链接
      };
      hotNews.push(news)              // 存入最终结果数组
    });
    return hotNews
  };


//   4、将抓取的数据返回给前端浏览器
/**
 * [description] - 跟路由
 */
// 当一个get请求 http://localhost:3000时，就会后面的async函数
app.get('/', async (req, res, next) => {
    res.send(hotNews);
  });