 var fs = require("fs");
 var iconv = require('iconv-lite');
 var Summary = require("./summary");
 var exec = require('child_process').exec;
 var send2kindle = require('./maildemo');
 var process = require("process");
 var bookpath = require('./bookpath');
 var path = require('path');
 var bookinfo = require('./templates/book.json');

 var buf = new Buffer(1024);

 var filepath = "resource/t.txt";
 //   var reg = /第[0-9零○一二两三四五六七八九十百千廿卅卌壹贰叁肆伍陆柒捌玖拾佰仟万]{1,5}[章节節堂讲回集部分]\s{1,2}\S{1,100}/g;
 var reg = /[章]{1}[零一二两三四五六七八九十百千廿卅卌壹贰叁肆伍陆柒捌玖拾佰仟万１２３４５６７８９０]{1,5}\s{1,2}\S{1,100}/g;
 var noval = ''; // 小说文本
 var list = []; // 小说目录
 var arysum = []; // 预格式化成summary.md的对象数组

 var summarymd = ''; // 格式化成summary.md的字符串

 try {
     // 小说
     noval = iconv.decode(fs.readFileSync(filepath), 'gbk');


     // 获取所有章节目录
     var list = noval.match(reg);

     if (!list || list.length === 0) {
         throw new Error("reg is error");
     }

     var chapters = [];

     list.forEach(function (val, index) {
         chapters.push(new Chapter(val, getChapterContent(noval, val, list[index + 1])));
         console.log(val);
     })

     // 生成summary.md,chapter,book.json,readme.md
     var summarymd = '# summary\r\n';
     chapters.forEach(function (val) {
         var relativePath = path.relative(path.dirname(bookpath.summary), val.path);
         summarymd += '* [chapter](path)\r\n'.replace('chapter', val.title).replace('path', relativePath);

     })

     createSummarymd(summarymd);
     createChapters(chapters);
     createBookjson();
     createReadme();

     // generate mobi and send mail to kindle
     console.log('generate mobi...');
     generatemobi(bookpath.rmtmp, send2kindle.send2kindle);
     console.log('generate mobi success');


 } catch (e) {
     console.log(e);
 } finally {
     bookpath.rmtmp();
 }


 // 获取小说目录array
 function smy(ary) {
     var str = '#Summary\r\n';
     ary.forEach(function (data, index) {
         var s = '* [name](path)'.replace("name", data.name).replace("path", data.path);
         s += "\n\r";
         str += s;

     })
     return str;
 }

 function createSummarymd(summarymd) {
     var path = bookpath.summary;
     fs.open(path, 'w', function (err, stats) {
         if (err) throw err;
         fs.writeFile(path, summarymd, function (err) {
             if (err) throw err;
             fs.close(stats, function (err) {
                 if (err) throw err;
             })
         })

     });
 }


 function createChapters(chapters) {
     chapters.forEach(function (chap, index) {

         fs.open(chap.path, 'w', function (err, stats) {
             if (err) throw err;
             fs.writeFile(chap.path, chap.content, function (err) {
                 if (err) throw err;
                 fs.close(stats, function (err) {
                     if (err) throw err;
                 })
             })
         })
     })
 }

 function createBookjson() {

     fs.open(bookpath.bookjsonpath, 'w', function (err, stats) {
         if (err) throw err;
         fs.writeFile(bookpath.bookjsonpath, JSON.stringify(bookinfo), function (err) {
             if (err) throw err;
             fs.close(stats, function (err) {
                 if (err) throw err;
             })
         })
     })
 }

 function createReadme() {
     fs.open(bookpath.readme, 'w', function (err, stats) {
         if (err) throw err;
         fs.close(stats, function (err) {
             if (err) throw err;
         })
     })
 }

 function generatemobi(callback) {
     //调用shell，gitbook 生成mobi
     var root = bookpath.root + path.sep;
     var cli = 'gitbook mobi ' + root + ' ' + bookpath.mobi(bookinfo.title);
     exec(cli, {
         encoding: 'utf8'
     }, function (err, stdout, stderr) {
         if (err) {
             console.log('stderr' + stderr);
             throw err;
         }
         console.log('stdout' + stdout);

         // callback
         if (arguments.length === 1) {
             if (typeof callback === 'function') callback();
         } else if (arguments.length > 1) {
             for (var i = 0; i < arguments.length; i++) {
                 if (typeof arguments[i] === 'function') {
                     arguments[i]();
                 }
             }
         }
     })
 }


 function Chapter(title, content) {
     this.title = title;
     this.content = content.replace(/[\x20]{4}/g, '  ');
     this.path = bookpath.chaptermd(title);
 }

 function getChapterContent(noval, chapterTitle, nextTitle) {
     var start = noval.search(chapterTitle);
     var end;
     if (nextTitle) {
         end = noval.search(nextTitle);
     }

     return end ? noval.slice(start, end) : noval.slice(start);
 }

 function getType(o) {
     var t = Object.prototype.toString.call(o);
     return t.slice(8, -1);
 }