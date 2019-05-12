# post-tweet-from-slack

デプロイ方法  
`zip -r lambdaupload.zip ./index.js ./node_modules/`

【超ざっくりの処理の流れ】
```
1. slackでリアクションを押す
2. slackのevent apiのreaction_addedが発火する
3. lambdaに届く
　3-1. 再実行のリクエスト化をチェック
　3-2. どんなリアクションを押したかのチェック
　3-3. slack apiのconversations.historyでリアクションされたメッセージを取得する(残念ながら2で発火されるリクエストにメッセージが含まれていないです。。)
　3-4. tweetを行う
4. 3秒以内に3の処理が終わらないので、slackがタイムアウトして再実行する(再実行の際は3-1で終了する)
```
