const AUTH_GATEWAY_IP = '10.181.137.12:8080'; //'10.181.130.220:8080';//'qdlsq0241.us.qdx.com:8080';
const AUTH_GATEWAY_IP_HTTP = 'http://' + AUTH_GATEWAY_IP;
// const AUTH_GATEWAY_IP_HTTP = 'http://auth-gateway-dev2.mq.questdiagnostics.com';
// const AUTH_GATEWAY_IP_HTTP = 'http://Q11GDH08W10-5.us.qdx.com:8082';
const GOOGLE_MAPS_HTTPS = 'https://maps.googleapis.com/maps/api';
const FORWARD_HOST = 'localhost:4201';

// when behind a corporate proxy
// https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md#using-corporate-proxy
const HttpsProxyAgent = require('https-proxy-agent');
const QUEST_PROXY_USERNAME = process.env.QUEST_PROXY_USERNAME || '';
const QUEST_PROXY_PASSWORD = process.env.QUEST_PROXY_PASSWORD || '';
const QUEST_PROXY_SERVER = `http://${QUEST_PROXY_USERNAME}:${QUEST_PROXY_PASSWORD}@qproxy.qdx.com:9090`;
const httpsAgent = new HttpsProxyAgent(QUEST_PROXY_SERVER);

const PROXY_CONFIG = [{
  context: ['/google-maps'],
  target: GOOGLE_MAPS_HTTPS,
  secure: false,
  pathRewrite: {
    '^/google-maps': ''
  },
  logLevel: 'debug',
  //agent: httpsAgent,
  changeOrigin: true
},
{
  context: ['/guest'],
  target: AUTH_GATEWAY_IP_HTTP,
  secure: false,
  pathRewrite: {
    '^/guest': '/mq-service/guest'
  },
  // agent: httpsAgent,
  changeOrigin: true
},
{
  context: ['/mq-service/login-request'],
  target: AUTH_GATEWAY_IP_HTTP,
  secure: false,
  logLevel: 'debug',
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    // add custom header to request
    proxyReq.setHeader('x-forwarded-for', AUTH_GATEWAY_IP);
    proxyReq.setHeader('x-forwarded-host', FORWARD_HOST);
    proxyReq.setHeader('x-forwarded-proto', 'http');
  }
},
{
  context: ['/mq-service/login/cas'],
  target: AUTH_GATEWAY_IP_HTTP,
  secure: false,
  logLevel: 'debug',
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    // add custom header to request
    proxyReq.setHeader('x-forwarded-for', AUTH_GATEWAY_IP);
    proxyReq.setHeader('x-forwarded-host', FORWARD_HOST);
    proxyReq.setHeader('x-forwarded-proto', 'http');
  }
},
{
  context: ['/logout'],
  target: AUTH_GATEWAY_IP_HTTP,
  secure: false,
  logLevel: 'debug',
  pathRewrite: {
    '^/logout': '/mq-service/logout'
  },
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    // add custom header to request
    proxyReq.setHeader('x-forwarded-for', AUTH_GATEWAY_IP);
    proxyReq.setHeader('x-forwarded-host', FORWARD_HOST);
    proxyReq.setHeader('x-forwarded-proto', 'http');
  }
},
{
  context: ['/mq-service/logout-success'],
  target: AUTH_GATEWAY_IP_HTTP,
  secure: false,
  logLevel: 'debug',
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    // add custom header to request
    proxyReq.setHeader('x-forwarded-for', AUTH_GATEWAY_IP);
    proxyReq.setHeader('x-forwarded-host', FORWARD_HOST);
    proxyReq.setHeader('x-forwarded-proto', 'http');
  }
},
{
  context: ['/change-password-request'],
  target: AUTH_GATEWAY_IP_HTTP,
  secure: false,
  logLevel: 'debug',
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    // add custom header to request
    proxyReq.setHeader('x-forwarded-for', AUTH_GATEWAY_IP);
    proxyReq.setHeader('x-forwarded-host', FORWARD_HOST);
    proxyReq.setHeader('x-forwarded-proto', 'http');
  }
},
{
  context: ['/mq-service/change-password-success'],
  target: AUTH_GATEWAY_IP_HTTP,
  secure: false,
  logLevel: 'debug',
  onProxyReq: function onProxyReq(proxyReq, req, res) {
    // add custom header to request
    proxyReq.setHeader('x-forwarded-for', AUTH_GATEWAY_IP);
    proxyReq.setHeader('x-forwarded-host', FORWARD_HOST);
    proxyReq.setHeader('x-forwarded-proto', 'http');
  }
},
{
  context: ['/api'],
  target: AUTH_GATEWAY_IP_HTTP,
  secure: true,
  pathRewrite: {
    '^/api': '/mq-service/api'
  }
}
];

module.exports = PROXY_CONFIG;
