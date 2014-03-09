## What is this?

JAWS DAYS 2014 九州・沖縄SAMURAIハンズオン：AWS料金体系グランドマスター王者決定戦 に参加して、回答を投票するためのプログラムです。
http://jawsdays2014.jaws-ug.jp/



## Dependencies

* modern web browsers
* vert.x http://vertx.io/


## Configuring

* CreateTables.sqlを流して、DBとアカウント、テーブルを作成します。
* web/assets/js/data.js と web/viewer/assets/js/main.js ファイルにデプロイしたURLや質問を設定します。


## Running the Server

    $ ./startup.sh

* 投票画面 http://localhost:8080/
* 回答結果画面 http://localhost:8080/viewer/index.html

回答画面で設問を選択してから、投票してみてください。リアルタイムにオブジェクトが描画されると思います。

【Connection Status が Connected の状態で、ブラウザとサーバが接続完了した状態になります。それ以外のステータスでは、動作しないのでご注意下さい。】

## 既知の問題

* オブジェクトを多数描画するとレンダリングがストップする（ので賑やかしと投稿がそれぞれ3/4個ずつしか描画できません。。。）

    Uncaught TypeError: Cannot call method 'dispatchEvent' of undefined three.min.js:317
221
	Uncaught TypeError: Cannot read property 'immediateRenderCallback' of undefined


* スマートフォンからは投票はできますが、回答結果は見れません（たぶん。。。）。


contact to [@k_nishijima](https://twitter.com/k_nishijima)
