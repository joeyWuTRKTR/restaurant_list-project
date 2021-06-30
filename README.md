# 餐廳清單

<br>

此專案可以讓使用者瀏覽、搜尋特定的餐廳，並且可以點擊餐廳圖示瀏覽更詳細的餐廳資訊。

<br>

## 畫面瀏覽
![alphacamp 2-3 A3 作業](https://user-images.githubusercontent.com/78346513/123622455-ce8f4580-d83e-11eb-8634-9d005a0ea655.png)

## 建置環境

<br>

* node.js : ^10.15.0
* express: ^4.17.1
* express-handlebars: ^5.3.2
* mongoose: ^5.12.0

<br>

## 安裝流程

<br>

1. 藉由 git clone 將專案下載至本地
```
git clone https://github.com/WilliamTsou818/restaurant-list.git
```
2. 進入專案資料夾
```
cd restaurant-list
```
3. 安裝套件
```
npm i express express-handlebars nodemon
```
4. 加入種子資料
```
npm run seed
```
5. 啟動網頁伺服器
```
npm run dev
```
6. 出現下列訊息，表示啟動成功，可點選連結開啟網頁

The server is running on http://localhost:3000
