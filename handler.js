const request = require('request');
const cheerio = require('cheerio');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

module.exports.run = async () => {
  const client = new SNSClient({
    credentials: {
      accessKeyId: process.env.AWS_AKI,
      secretAccessKey: process.env.AWS_SAK
    }, 
  region: 'eu-west-2' 
})

  const publishMsg = async () => {
    const params = {
      Message: 'PS5 in stock!',
      TopicArn: 'arn:aws:sns:eu-west-2:064830315206:PS5-Alert'
    };

    const message = new PublishCommand(params);
    const response = await client.send(message);
    console.log(response);
  }


  request('https://www.amazon.co.uk/PlayStation-9395003-5-Console/dp/B08H95Y452/ref=sr_1_3?dchild=1&keywords=ps5&qid=1633547007&qsid=257-7272828-9504927&sr=8-3&sres=B08H95Y452%2CB08H97NYGP%2CB08H99BPJN%2CB0976G3MQ3%2CB098TV5XPX%2CB08H99878P%2CB0957KZJF2%2CB094WRT8PD%2CB09HR716CH%2CB094WLFGD3%2CB09HKYMV85%2CB08SMCX49D%2CB08RHT29CQ%2CB09G2MQCJ5%2CB092PS7JS9%2CB08K31R1H7', (err, response, html) => {
    if (!err && response.statusCode == 200) {
      const $ = cheerio.load(html);

      const stocked = $('.a-color-success');

      if (stocked.html() === null) {
        publishMsg();
      } else {
        console.log('Not in stock');
      }
    };
  });
};
