# genmobi
目前仅支持txt生成mobi格式，主要用于把txt格式的小说生成mobi格式

#### 依赖的软件
* [gitbook](https://github.com/GitbookIO/gitbook)
* [Calibre](https://kindlefere.com/tools#calibre)

由于没有界面，导致适用范围窄，需要在index.js中修改 filepath (txt文件地址) 和 reg (正则表达式，用于识别小说目录).  
下一个大版本将增加界面操作,并考虑移除软件依赖