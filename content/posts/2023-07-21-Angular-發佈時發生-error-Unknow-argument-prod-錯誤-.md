+++
title = '【Angular】error Unknow argument prod錯誤'
date = '2023-07-21'
slug = 'Angular-發佈時發生-error-Unknow-argument-prod-錯誤-'
url = '/2023/07/21/Angular-發佈時發生-error-Unknow-argument-prod-錯誤-/'
description = ''
categories = ['前端技術', 'Angular']
tags = ['Angular']
keywords = ['ES6', 'Angular', '網頁']
image = '/img/Web/bg/Angular-bg-01.png'
+++

## Error Unknow argument prod
當初使用時， ```ng build --prod```已經無法使用這指令，請使用下方指令排除現狀。

```cli
ng build --configuration production
```

### 備註
Angular 14 之後版本已經移除 ```--prod```指令，改為 ```--configuration production```。
### Angular Cli



## 參考文件
- ithome : https://ithelp.ithome.com.tw/articles/10195372
- stackoverflow : https://stackoverflow.com/questions/73156911/ng-build-prod-error-unknown-argument-prod