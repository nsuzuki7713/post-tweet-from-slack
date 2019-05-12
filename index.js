exports.handler = (event, context, callback) => {
  if(event.headers["X-Slack-Retry-Num"]){
    console.log("リトライのため終了");
    console.log(event);
    callback(null, {statusCode: 200,body: JSON.stringify({ok:"ok"})});
    return;
  }
  
  const body = JSON.parse(event.body);
  console.log(event);
  console.log("channel:" + body.event.item.channel);
  console.log("latest:" + body.event.item.ts);
  console.log("reaction:" + body.event.reaction);
  
  if(body.event.reaction !== 'tweet'){
    console.log("tweetリアクションではないので終了")
    callback(null, {statusCode: 200,body: JSON.stringify({ok:"ok"})});
    return;
  }
  
  const twitter = require('twitter');
  const twitter_client = new twitter({
      consumer_key: 'xxxxxx',
      consumer_secret: 'xxxxxx',
      access_token_key: 'xxxxxx',
      access_token_secret: 'xxxxxx'
  });
  
  // axios を require してインスタンスを生成する
  const axiosBase = require('axios');
  const axios = axiosBase.create({
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    responseType: 'json'  
  });
  
  const queries = {
    token: "xoxp-xxxxxx",
    latest:body.event.item.ts,
    limit:1,
    inclusive:true,
    channel: body.event.item.channel
  };
      
  axios.get('https://slack.com/api/conversations.history/',{params: queries})
    .then(res => {
      const emoji = require('node-emoji')
      const text = emoji.emojify(res.data.messages[0].text);
      console.log("ツイート文章")
      console.log(text);
        
      twitter_client.post('statuses/update', {status: text + '\nslackからの投稿です。'},  function(error, tweet, response){
        if(error) {
            console.log('Twitter APIエラー.');
            console.log(error);
        }
        console.log('Twitter完了');
      });
    }).catch(err => {
      console.log(err);
  });
  
  callback(null, {statusCode: 200,body: JSON.stringify({ok:"ok"})});
  return;
};
