module.exports = {
  '/weixin/oauth/access': function(app, urls) {
    var oauth = require('../lib/oauth');
    return function(req, res) {
      var state = 'STATE';

      //0 表示 基本信息
      //1 表示 用户信息
      var scope = 0;
      oauth.init(app, urls);
      oauth.setAccess(state, scope);
      oauth.access(req, res);
    };
  },
  '/weixin/oauth/success': function(app, urls, cb) {
    var oauth = require('../lib/oauth');
    return function(req, res) {

      var code = req.param('code');
      if (!code) {
        res.redirect(this.urls.access);
        return;
      }
      oauth.init(app, urls);
      oauth.setSuccess(code)
      oauth.success(req, res, function(error, json) {
        if (error) {
          res.redirect(urls.access);
          return;
        }
        var weixin = {};
        weixin.openid = json.openid;
        weixin.accessToken = json.access_token;
        weixin.refreshToken = json.refresh_token;
        req.session.weixin = weixin;
        if (cb) {
          cb(res, weixin);
        }
      });
    };
  },
  '/weixin/oauth/redirect':function(app, urls, cb) {
    return function(req, res) {
      res.write('Oauth Success! Please specify your url with  --redirect directive!');
    }
  }
};