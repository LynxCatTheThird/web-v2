@echo off
title 正在复制
ren C:\Users\LynxCatTheThird\web\_config.yml person_netlify_config.yml.
rd /s /q person-netlify
xcopy person person-netlify /e /h /c /i 
title 正在修改配置文件
rename C:\Users\LynxCatTheThird\web\person_netlify_config.yml _config.yml.
copy  /Y C:\Users\LynxCatTheThird\web\_config.yml C:\Users\LynxCatTheThird\web\person-netlify\_config.yml
title 正在部署
cd /d C:\Users\LynxCatTheThird\web\person-netlify\
hexo cl&&hexo cl&&hexo g&&hexo d&&hexo d&&title 正在清理&&cd /d C:\Users\LynxCatTheThird\web&&rd /s /q person-netlify&&title 完成&&ren C:\Users\LynxCatTheThird\web\_config.yml person_netlify_config.yml.&&echo 完成&&pause