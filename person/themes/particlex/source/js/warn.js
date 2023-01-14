function browserVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
    var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //Edge浏览器
    var isFirefox = userAgent.indexOf("Firefox") > -1; //Firefox浏览器
    var isOpera = userAgent.indexOf("Opera")>-1 || userAgent.indexOf("OPR")>-1 ; //Opera浏览器
    var isChrome = userAgent.indexOf("Chrome")>-1 && userAgent.indexOf("Safari")>-1 && userAgent.indexOf("Edge")==-1 && userAgent.indexOf("OPR")==-1; //Chrome浏览器
    var isSafari = userAgent.indexOf("Safari")>-1 && userAgent.indexOf("Chrome")==-1 && userAgent.indexOf("Edge")==-1 && userAgent.indexOf("OPR")==-1; //Safari浏览器
    if (isIE || isIE11) {
        alert('很抱歉，本站不支持 IE 浏览器')
    } else if(isEdge) {
        if(userAgent.split('Edge/')[1].split('.')[0]<90){
            alert('很抱歉，您的浏览器版本过旧，可能会遇到问题，建议您升级浏览器')
        }
    } else if(isFirefox) {
        if(userAgent.split('Firefox/')[1].split('.')[0]<78){
            alert('很抱歉，本站最低需要 78 版本的 Firefox 才能渲染大多数内容')
        }
    } else if(isOpera) {
        if(userAgent.split('OPR/')[1].split('.')[0]<80){
            alert('很抱歉，您的浏览器版本过旧，可能会遇到问题，建议您升级浏览器')
        }
    } else if(isChrome) {
        if(userAgent.split('Chrome/')[1].split('.')[0]<90){
            alert('很抱歉，您的浏览器版本过旧，可能会遇到问题，建议您升级浏览器')
        }
    } else if(isSafari) {
        alert('Safari 的支持情况未知，欢迎反馈')
    }
}
function setCookies(obj, limitTime) {
	let data = new Date(new Date().getTime() + limitTime * 24 * 60 * 60 * 1000).toGMTString()
	for (let i in obj) {
		document.cookie = i + '=' + obj[i] + ';expires=' + data
	}
}
function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}
if(getCookie('browsertc')!=1){
    setCookies({
        browsertc: 1,
    }, 1);
    browserVersion();
}
// 作者: 『轻笑Chuckle』
// 链接: https://chuckle.top/article/e61f6567.html
// 来源: 轻笑Chuckle