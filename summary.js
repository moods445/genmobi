var bookpath = require('./bookpath');

var Summary = function(name,path){
    this.name = name;
    this.path = path;
    this.children = [];
}

var Chapter = function(title,content){
    this.title =  title;
    this.content = content;
    this.path = bookpath.chaptermd(title);
}



module.exports = Summary;