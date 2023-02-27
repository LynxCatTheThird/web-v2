---
title: 欢迎！
date: 2022-12-07 07:48:09
---

## 关于我

``` cpp
#include<cstdio>
#include<string>
using namespace std;
int main(){
	string name="LynxCatTheThird",good_at="C++",hobby[2]={"编程","van"},wip[2]={"一些科幻作品","CSP-J"};
	int age=14;
	printf("我叫 %s。",name.c_str());// 好像是个废话
	printf("我 %d 岁了。",age);// 英语作文后遗症
	printf("对 %s 略知一二。",good_at.c_str());
	printf("喜欢 %s 和 %s 。",hobby[0].c_str(),hobby[1].c_str());
	printf("正在为 %s 和 %s 努力。",wip[0].c_str(),wip[1].c_str());
	return 114514; // LOL
}
```

使用 [ParticleX](https://github.com/argvchs/hexo-theme-particlex/) 主题，感谢 [@Argvchs](https://github.com/argvchs/)（个人博客地址：<https://argvchs.github.io>）

## 关于小站

|部署平台|源地址|自定义域名|
|:-:|:-----------------------|:-|
|Github|[https://lynxcatthethird.github.io/](https://lynxcatthethird.github.io/)|重新部署会杀掉自定义域名，很麻烦|
|Github 2|[https://ara1145.github.io/](https://ara1145.github.io/)|同上|
|Netlify|[https://lynxcatthethird-person.netlify.app/](https://lynxcatthethird-person.netlify.app/)|[https://ml.lynxcatthethird.eu.org/](https://ml.lynxcatthethird.eu.org/)|
|Vercel|[https://lynxcatthethird-person.vercel.app/](https://lynxcatthethird-person.vercel.app/)|[https://vc.lynxcatthethird.eu.org/](https://vc.lynxcatthethird.eu.org/)|
|Cloudflare Pages|[https://lynxcatthethird-person.pages.dev/](https://lynxcatthethird-person.pages.dev/)|[https://cf.lynxcatthethird.eu.org/](https://cf.lynxcatthethird.eu.org/)|

用作日常发文、技术发文、闲聊、随笔等日常用途

## 注：

1. 本站服务器资源白嫖于免费服务商，比较慢。所以请您耐心等等，不要过于频繁的清理缓存，以免影响体验。
2. 已知 oisd full 中有一条规则会屏蔽不蒜子导致访问次数无法显示。本站永远不会插入广告（站长不会这样做，也没这个本事），若出现问题，请您将小站加入白名单，谢谢！

## News：

2023年1月14日：更换字体加载方式为 [Staticfile CDN](http://www.staticfile.org/)，速度快到飞起。

2023年1月1日2023年1月3日：启用新域名。

2022年12月26日：启用 ServiceWorker。具体速度因浏览器和设备而异，请自行测试。

2022年12月22日：评论系统换为 Twikoo。

2022年12月21日：不用 Jsdelivr 加载字体了，改用托管的服务器自己承担。具体速度因地因时因人而异，请自行测试。

2022年12月16日：评论系统换为 Waline 。在此特别感谢 Yuzi0201。
