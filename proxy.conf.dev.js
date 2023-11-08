const GOOGLE_MAPS_HTTPS = 'https://maps.googleapis.com/maps/api';
const CMS_TARGET = 'http://host.docker.internal:8000';
const CIT_SERVICES_TARGET = 'http://host.docker.internal:8889';
const CIT_QUEST_API_TARGET = 'http://host.docker.internal:8021';
const MYQUEST_QUEST_API_TARGET = 'http://host.docker.internal:8020';

const PROXY_CONFIG = [
  {
    context: ['/google-maps'],
    target: GOOGLE_MAPS_HTTPS,
    secure: false,
    pathRewrite: {
      '^/google-maps': ''
    },
    changeOrigin: true
  },
  {
    context: [
      '/api/products',
      '/api/pricing',
      '/api/stores',
      '/api/carts',
      '/guest/carts',
      '/api/orders',
      '/guest/orders'
    ],
    target: CIT_SERVICES_TARGET,
    secure: false
  },
  {
    context: ['/cms'],
    target: CMS_TARGET,
    secure: false,
    pathRewrite: {
      '^/cms': ''
    }
  },
  {
    context: [
      '/api/getPaymentCardURL',
      '/makePayment',
      '/createEncounter',
      '/api/getEid',
      '/guest/getPscsWithAvailability',
      '/guest/getPscAvailability',
      '/guest/createAppointment',
      '/api/createAppointment',
      '/guestRecaptcha/createAccount',
      '/guest/getSecurityQuestions',
      '/api/getAdvancedAccessCount',
      '/guest/accountExists',
      '/guest/getTermsAndConditions',
      '/guest/holdAppointment',
      '/guest/confirmAppointment',
      '/releaseAppointment',
      '/guestRecaptcha/createCitAccount',
      '/api/getOrders',
      '/api/getOrder',
      '/api/getOrder/599012'
    ],
    target: CIT_QUEST_API_TARGET,
    secure: false,
    pathRewrite: {
      '^/': '/mq-service/v1/'
    }
  },
  {
    context: ['/api'],
    target: MYQUEST_QUEST_API_TARGET,
    secure: false,
    pathRewrite: {
      '^/api': '/mq-service/v1/api'
    }
  },
  {
    context: ['/results/pdf'],
    target: MYQUEST_QUEST_API_TARGET,
    secure: false,
    pathRewrite: {
      '^/results/pdf': '/mq-service/v1/api/downloadLab'
    }
  },
  {
    context: ['/guest'],
    target: MYQUEST_QUEST_API_TARGET,
    secure: false,
    pathRewrite: {
      '^/guest': '/mq-service/v1/guest'
    }
  },
  {
    context: ['/guestrecapcha'],
    target: MYQUEST_QUEST_API_TARGET,
    secure: false,
    pathRewrite: {
      '^/guest': '/mq-service/v1/guestrecapcha'
    }
  }
];

module.exports = PROXY_CONFIG;
