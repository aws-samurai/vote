## What is this?

JAWS DAYS 2014 九州・沖縄SAMURAIハンズオン：AWS料金体系グランドマスター王者決定戦 に参加して、回答を投票するためのプログラムです。
http://jawsdays2014.jaws-ug.jp/



## Dependencies

* modern web browsers
* vert.x http://vertx.io/


## Configuring

CreateTables.sqlを流して、DBとアカウント、テーブルを作成します。

web/data.jsファイルを編集し、設問や回答を設定します。

### var APP_EB_URL
* デプロイしたURLを設定します。

### var data
* questions に質問を設定します。idがプライマリキー、txtに本文を書いて下さい。
* answer + id（プライマリキー）に、回答を設定します。vote1 から vote4 は連番で記述し、もし4つ以上の選択肢を増やしたい場合は vote.html にもボタンを増やして下さい。
* 必ず設問の数とanswerの数が一致するようにして下さい。


## Running the Server

    $ ./startup.sh

* 投票画面 http://localhost:8080/
* 回答結果画面 http://localhost:8080/viewer/index.html

回答画面で設問を選択してから、投票してみてください。リアルタイムにオブジェクトが描画されると思います。

【Connection Status が Connected の状態で、ブラウザとサーバが接続完了した状態になります。それ以外のステータスでは、動作しないのでご注意下さい。】

## 既知の問題

* オブジェクトを多数描画するとレンダリングがストップする

    Uncaught TypeError: Cannot call method 'dispatchEvent' of undefined three.min.js:317
221
	Uncaught TypeError: Cannot read property 'immediateRenderCallback' of undefined



* スマートフォンからは投票はできますが、回答結果は見れません。
* 回答結果はどこにも保存されません。サーバを止めた時点で消えてなくなります。
* 回答結果画面は、設問を選択したあと、誰かが解答を投票しないと結果が画面に反映されません
* あまりまじめに排他していないので、ボタン連打をすると集計が狂う可能性があります。
* あまりまじめに（略）、変なデータを投げると壊れるので気を付けて下さい。


## 画面をCSSで綺麗にしたり、データ永続化/後日ダウンロード機能などのプルリクお待ちしております(^^)

contact to [@k_nishijima](https://twitter.com/k_nishijima)
