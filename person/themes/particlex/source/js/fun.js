// 伪造错误代码
function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}
var a = randomNum(1, 8);
if (a == 1) {
    var b = 0;
    var c = Math.round(Math.random());
} else if (a == 2 || a == 6) {
    a = 2;
    var b = 0;
    var c = Math.floor(Math.random() * 7);
} else if (a == 3) {
    var b = 0;
    var c = randomNum(1, 4);
    if (c == 3) {
        c = 7;
    }
} else if (a == 4 || a == 7 || a == 8) {
    a = 4;
    var b = Math.floor(Math.random() * 3);
    if (b == 0) {
        var c = randomNum(1, 6);
        if (c == 2) {
            c = 7;
        }
    } else if (b == 1) {
        var c = randomNum(2, 7);
    } else {
        var c = 3;
    }
} else {
    var b = 0;
    var c = Math.floor(Math.random() * 6);
}

// 伪造报错信息
console.info("%c Powered by ■■■■■■ %c 请求头解析成功，正在访问 LynxCatTheThird 的博客", "color:white; background-color:#4f90d9", "");
console.error("Failed to load resource: the server responded with a status of", a.toString() + b.toString() + c.toString(), "()");
console.error("■■■■■,■■■■■■,■■■■■. ■■■■■■■: ■■■■■■■■■■■");
console.warn("%c P23-276 %c cmr.js 加载完成，你现在处于监控中", "color:white; background-color:#e09d3e", "");
console.warn("%c P23-274 %c clk.js 加载完成，你现在处于监控中", "color:white; background-color:#e09d3e", "");
console.error("Failed to load resource: net::ERR_BLOCKED_BY_CLIENT");
console.warn("%c P23-275 %c kbd.js 加载完成，你现在处于监控中", "color:white; background-color:#e09d3e", "");

// 声明
console.info("%c Debug %c %c ServiceWorker测试 %c fun.js 更新时间：2023年1月5日09点48分", "color:white; background-color:#4f90d9", "", "color:white; background-color:#4f90d9", "");
console.error("%c W06-7752 %c 检测到打开控制台", "color:white; background-color:#d9534f", "");
console.warn("%c W06-7752 %c \n本站永远不会限制 F12，如有需要请自取\n主题地址：https://github.com/LynxCatTheThird/hexo-person-new/tree/main/person/themes/particlex\n请遵守 AGPLv3 开源协议，谢谢", "color:white; background-color:#e09d3e", "");

// 切走页面的标题
var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        document.title = 'w(ﾟДﾟ)w 不要走啊！再看看吧！！';
        clearTimeout(titleTime);
    }
    else {
        document.title = '♪(^∇^*) 嘿嘿，又见面了！';
        titleTime = setTimeout(function () {
            document.title = OriginTitle;
        }, 2000);
    }
});