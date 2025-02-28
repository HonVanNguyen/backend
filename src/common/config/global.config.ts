import * as dotenv from 'dotenv';
import { RecursiveKeyOf } from '../types/utils.type';

dotenv.config();

const globalConfig = {
  environment: process.env.NODE_ENV,
  port: +process.env.PORT || 5002,

  defaultAdmin: {
    username: process.env.DEFAULT_ADMIN_USERNAME,
    password: process.env.DEFAULT_ADMIN_PASSWORD,
  },

  redis: {
    standAlone: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
    sentinels:
      process.env.REDIS_SENTINELS?.split('|')?.map((item) => {
        const [host, port] = item?.split(':') || [];
        return { host, port };
      }) || [],
    password: process.env.REDIS_PASSWORD,
    sentinelPassword: process.env.REDIS_SENTINEL_PASSWORD,
    redisGroupName: 'mymaster',
  },

  auth: {
    accessToken: {
      secret: process.env.AUTH_JWT_ACCESS_TOKEN_KEY,
      algorithm: 'HS256',
      expiresTime: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRE,
    },

    refreshToken: {
      secret: process.env.AUTH_JWT_REFRESH_TOKEN_KEY,
      algorithm: 'HS256',
      expiresTime: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRE,
    },

    verification: {
      tokenExpiresIn: 86400, // seconds, = 24h
      verifySuccessPath: '/verify-success',
    },
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessKeySecret: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,

    s3: {
      domain: process.env.AWS_S3_DOMAIN,
      bucketName: process.env.AWS_S3_BUCKET_NAME,
      limitSizeMb: +process.env.AWS_S3_LIMIT_SIZE_MB,
      presignTimeOut: +process.env.AWS_S3_PRESIGN_TIME_OUT,
      region: process.env.AWS_S3_REGION,
    },

    ses: {
      sender: {
        name: 'BiliSoftware',
        email: process.env.AWS_SES_SENDER_EMAIL,
      },
      templateName: {
        merchant: {
          verifyEmailRequest:
            process.env.AWS_SES_TEMPLATE_VERIFY_MERCHANT_REQUEST,
          accountApproved: process.env.AWS_SES_TEMPLATE_MERCHANT_APPROVED,
          accountRefused: process.env.AWS_SES_TEMPLATE_MERCHANT_REJECTED,
        },
      },
    },
  },

  zaloOA: {
    authUrl: process.env.ZALO_AUTH_URL,
    secretKey: process.env.ZALO_SECRET_KEY,
    appId: process.env.ZALO_APP_ID,
    znsUrl: process.env.ZALO_ZNS_URL,
  },
};

export default globalConfig;
export type GlobalConfig = Record<RecursiveKeyOf<typeof globalConfig>, string>;
