var fs = require('fs');
var path = require('path');
var fse = require('fs-extra');
var tmpPath;
var ebookpath = 'ebook';

// 新建临时目录
tmpPath = fs.mkdtempSync('mobi');
var summary = tmpPath + path.sep + 'summary.md';
var chapter = tmpPath + path.sep + 'chapter';
var mobi = function (bookName) {
    return ebookpath + path.sep + bookName + '.mobi';
}

fs.stat(ebookpath, function (err, stat) {
    if (err) {
        if (err.code === 'ENOENT') {
            fs.mkdir(ebookpath, function (err) {
                if (err) throw err;
            })
        }
    }
    if (stat) return;

})

fs.mkdir(chapter, function (err) {
    if (err) throw err;
})

var rmtmp = function () {
    fse.remove(tmpPath, function (err) {
        if (err) throw err;
        console.log('remove tmp folder', tmpPath, ' success');
    })
}

var chaptermd = function (chapterName) {
    return chapter + path.sep + chapterName + '.md';
}

var bookjsonpath = tmpPath + path.sep + 'book.json';
var readme = tmpPath + path.sep + 'readme.md';

exports.chapter = chapter;
exports.chaptermd = chaptermd;
exports.summary = summary;
exports.mobi = mobi;
exports.rmtmp = rmtmp;
exports.bookjsonpath = bookjsonpath;
exports.root = tmpPath;
exports.readme = readme;