+++
title = 'Line Bots(一) - 環境建立、註冊'
date = '2022-09-09T10:06:48'
slug = 'CSharp-Line-Bots-一-環境建立-註冊'
description = ''
categories = ['後端技術', 'C#', 'Line']
tags = ['C#', 'Line']
keywords = ['Net FrameWork', 'C#', 'Line']
image = 'https://developers.line.biz/media/services/bot-designer-main-contents.png'
+++
【C#】Line Bots是台灣最多的使用之一的APP，如果要向外推廣必須要從 Line 下手是最好的選擇。本次計畫會撰寫Line Message 使用方式，大致上只有簡單如何創建 Message API。

## [Line Developers](https://developers.line.biz/zh-hant/)
Line Developers 是 Line 提供的開發環境。詳細介紹 : [LINE Bot 開發者指南詳解](https://engineering.linecorp.com/zh-hant/blog/line-bot-guideline-1/)

## 註冊、創建環境
創建方式需要透過 Line Developers : [請點選](https://developers.line.biz/zh-hant/) 這個來進行註冊。這邊使用個人帳號即可。接下來，需要創建 "Project" 專案，如下圖。






因為我們下一個主題式 Message API 所以請選擇它。



## 創建 Message API Channel
創建部份Url 部分可以先不填入，後續有需要後面章節會在說明。




創建完畢後，現在有兩個重要資訊，務必要存起來。
1. Channel ID 
2. Channel secret 
3. Your user ID 
4. Channel access token

Channel access token 位置在於 Message API 分頁最下方點選即可。



以上資訊存檔資後，記得把機器人加入在Line 上面。

