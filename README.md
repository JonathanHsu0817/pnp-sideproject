> 使用該專案 Gulp 時，請輸入指令Gulp。

## 指令列表

- `gulp` - 執行開發模式(會開啟模擬瀏覽器並監聽相關檔案)
  - 若沒有自動開啟瀏覽器則可手動在瀏覽器上輸入 `http://localhost:8080/` 即可。
  - 假使監聽功能無效的話，可以檢查一下是否修改到資料夾的名稱等。
- `gulp build` - 執行編譯模式(不會開啟瀏覽器)
- `gulp clean` - 清除 dist 資料夾
- `gulp deploy` - 將 dist 資料夾部署至 GitHub Pages
  - 若無法部署到 GitHub Pages 的話，可以確定一下是否已經初始化專案等。

> 請務必確保已經在本機上輸入過 `npm install -g gulp`，否則電腦會不認識 `gulp` 指令哦。

## 說明

該分支專案預設載入 Bootstrap5 與 jQuery 等。

如需查看db.json，私訊我後，我會開啟json-server-auth

- Node v12.18.2
  - 實際測試 Node 12~14 都是可以運行的
  - 查看自己版本指令：`node -v`
- Gulp
  - CLI version: 2.3.0
  - Local version: 4.0.2
  - 查看自己版本指令：`gulp -v`
- git version 2.23.0
  - 查看自己版本指令：`git ---version`


