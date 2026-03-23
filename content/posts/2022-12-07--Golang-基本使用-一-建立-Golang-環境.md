+++
title = '【Golang】基本使用(一) - 建立 Golang 環境'
date = '2022-12-07T21:00:05'
slug = '-Golang-基本使用-一-建立-Golang-環境'
url = '/2022/12/07/-Golang-基本使用-一-建立-Golang-環境/'
description = ''
categories = ['後端技術', 'GO']
tags = ['GO']
keywords = []
image = '/image/20221207_21-26-48.png'
+++
## 前言
這邊主要說明Go創建、使用，如果已經有環境，請直接到下一章節。

# 設定環境
## 使用軟體
### 1. Notepad++ 

目前業界最常看到的一套軟體，不但是免費功能也很強大，是一支必備軟體，它的特性也可以隨意跟改語言。
按此下載 =>  https://notepad-plus-plus.org/downloads/

### 2. VS CODE

(又稱VSC)目前是網頁前端最常用的軟體，非常的實用可以使用其他的語言、BUG，非常多的外掛可以提供使用者下載。
下載點 => https://code.visualstudio.com/download

---

## 安裝Go語言
Go官網下載頁網址: https://golang.org/dl/
安裝時候，選擇安裝msi的副檔名下載，也是可以透過軟體包管理工具進行安裝，像是用windows的chocolatey, mac的homebrew, linux的apt-get或yum，只是用軟體包工具安裝的可能不會是目前的最新版本，必須要等待軟體包伺服器更新。


---

## 環境設定
1. 設定方面需要到 控制台\所有控制台項目\系統 旁有進階系統設定

2. 選擇標籤列上方有進階再按下環境設定。


3. 選擇後，按照下方圖示順序去做設定。


4. 以及新增一個GOROOT 路徑為 C:\ 即可


5. 完成後，請重開電腦後到cmd(command 命令指令字元)裡面輸入 go 按下enter 確認是否正常使用。

---
# 第一個程式
## [Marketplace](https://marketplace.visualstudio.com/vscode)
VSC 提供多項外掛可以給使用者多樣的選擇。需要安裝如下:
1. ### Go
https://marketplace.visualstudio.com/items?itemName=golang.Go

使用前，須設定Debug 環境，先切換至 Debug 模式：


按下左上方的 Play 按鈕，並選擇 Go 做為 Debug 環境，會出現一個launch檔案，參考下方內容：


```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Launch file",
            "type": "go",
            "request": "launch",
            "mode": "debug",
            "program": "${file}",
            "env":{},
            "args": []
        }
    ]
}
```
接著就可以開始使用內建 Console 或中斷點來 Debug 囉！


## 手動安裝GO TOOL
```cmd
$ go get -u -v [URL]
```
以下工具給予參考

```cmd
go get -u -v github.com/ramya-rao-a/go-outline
go get -u -v github.com/acroca/go-symbols
go get -u -v github.com/mdempsky/gocode
go get -u -v github.com/rogpeppe/godef
go get -u -v golang.org/x/tools/cmd/godoc
go get -u -v github.com/zmb3/gogetdoc
go get -u -v golang.org/x/lint/golint
go get -u -v github.com/fatih/gomodifytags
go get -u -v golang.org/x/tools/cmd/gorename
go get -u -v sourcegraph.com/sqs/goreturns
go get -u -v golang.org/x/tools/cmd/goimports
go get -u -v github.com/cweill/gotests/...
go get -u -v golang.org/x/tools/cmd/guru
go get -u -v github.com/josharian/impl
go get -u -v github.com/haya14busa/goplay/cmd/goplay
go get -u -v github.com/uudashr/gopkgs/cmd/gopkgs
go get -u -v github.com/davidrjenni/reftools/cmd/fillstruct
```
## 第一個程式
1. 範例 1 : 創建簡易的輸出功能
```go
package main
import "fmt"
func main(){
	fmt.Print("Hello Go. !!")
}
```

2. 範例 2 : Go 可以支援 Emoji
```go
package main
import "fmt"
func main() {
	var varByte byte = 'a'
	var varRun rune = '🧨'
	fmt.Printf("%c = %d and %c =%U\n", varByte, varByte, varRun, varRun)
}
```
---
# 補充

## 1. golang在go get時錯誤提示 : xx cannot download,xxx is a GOROOT, not a GOPATH. For more details see:...
- 刪除GOPATH中src目錄中的cmd目錄,再執行go get -v xxxxx

## 2.VSC預設變量
```cmd
${workspaceFolder} - VS Code 中打开的文件夹目录 （通常是项目的位置）
${workspaceFolderBasename} - 没有任何斜杠 (/)的 VS Code 中打开的文件夹目录
${file} - 目前打开文件的绝对位置
${relativeFile} - 目前打开文件相对于 workspaceFolder 的相对位置
${fileBasename} -  目前打开文件的文件名（有拓展名，如： main.cpp）
${fileBasenameNoExtension} - 目前打开文件的出去拓展名的文件名（无拓展名， 如： main.cpp）
${cwd} - task runner的工作目录
${fileDirname} - 目前打开文件的目录位置
${fileExtname} - 目前打开文件的拓展名
${lineNumber} - 文件中目前被选择的行数
${selectedText} - 文件中目前被选择的内容
```

## 3. CMD執行
```cmd
$ go run xx.go
```