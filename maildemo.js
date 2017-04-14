var nodemailer = require('nodemailer');
// var iconv = require('iconv-lite');

// send2KindleMail();

function send2KindleMail() {
    var mail163 = {
        host: 'smtp.163.com',
        port: 465,
        secure: true,
        auth: {
            user: 'mail@mail.com',
            pass: '163'
        }
    }
    var mailqq = {
        service: 'qq',
        //  port:465,
        secure: false,
        auth: {
            user: 'qq@qq.com',
            pass: 'qq'
        }
    }
    var transporter = nodemailer.createTransport(mail163);

    var mailOptions = {
        from: "163@163.com",
        to: "kindle@kindle.cn",
        subject: "kindle",
        html: 'kindlebook',
        attachments: [{
            filename: '1.mobi',
            path: './1.mobi'
        }]
    }
    transporter.sendMail(mailOptions, function (err, info) {
        if (err) throw err;
        console.log(info);
    })
}

exports.send2kindle = send2KindleMail;