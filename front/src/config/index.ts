export default {
  // API Request Settings
  baseUrl: {
    dev: {
      // eth: 'http://192.168.3.126:8000/',
      // eth: 'http://192.168.194.44:8000/',
      eth: 'http://13.212.172.9/',
    },
    pro: {
      eth: 'http://13.212.172.9/',
    },
  },
  imgBed: {
    // baseUrl: 'https://sm.ms/api/v2/',
    baseUrl:
      'https://service-9kxv6jbe-1252075447.hk.apigw.tencentcs.com/release/', // Tencent Cloud Function
    tokenPath: 'token/',
    uploadPath: 'upload/',
    user: {
      name: 'abnernat',
      password: 'Docrid1cul0us',
    },
  },
};
