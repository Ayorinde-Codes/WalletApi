require('dotenv').config();

let CONFIG = {} //Make this global to use all over the application

CONFIG.app          = process.env.APP   || 'dev';
CONFIG.port         = process.env.PORT  || '3000';

CONFIG.db_dialect   = process.env.DB_DIALECT    || 'mysql';
CONFIG.db_host      = process.env.DB_HOST       || 'localhost';
CONFIG.db_port      = process.env.DB_PORT       || '3306';
CONFIG.db_name      = process.env.DB_NAME       || 'db_name';
CONFIG.db_user      = process.env.DB_USER       || 'root';
CONFIG.db_password  = process.env.DB_PASSWORD   || '';
CONFIG.INSTANCE_CONNECTION_NAME  = process.env.INSTANCE_CONNECTION_NAME   || '';
CONFIG.Boss_Mail  = process.env.Boss_Mail   || '';
CONFIG.TemplateId  = process.env.TemplateId   || '';
CONFIG.TemplateIdTransaction  = process.env.TemplateIdTransaction   || '';
CONFIG.PaystackTestSecret  = process.env.PaystackTestSecret   || '';
CONFIG.PaystackTestKey  = process.env.PaystackTestKey   || '';
CONFIG.PaystackLiveKey  = process.env.PaystackLiveKey   || '';
CONFIG.PaystackLiveSecret  = process.env.PaystackLiveSecret   || '';


CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || '';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '10000';

module.exports = CONFIG;
