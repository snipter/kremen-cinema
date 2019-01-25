import { APIGatewayProxyHandler } from 'aws-lambda';
import Bot from 'bot/index';
import { Log, okResp } from 'utils';
const log = Log('handler');

const { env } = process;
const TOKEN = env.BOT_TOKEN;
if (!TOKEN) {
  log.err('Bot token not specified');
  process.exit(1);
}

const cacheEnabled = (env.CACHE_ENABLED === "false") || (env.CACHE_ENABLED === "0") ? false : true;
log.debug(cacheEnabled ? 'cache enabled' : 'cache disabled');
const bot = new Bot(TOKEN, cacheEnabled);

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  log.debug(event);
  const { httpMethod, body } = event;
  if ((httpMethod === 'POST') && body) {
    log.debug('POST request');
    const data = JSON.parse(body);
    await bot.processUpdate(data);
  }
  if (httpMethod === 'GET') {
    log.debug('GET request, ignoring');
  }
  return okResp();
};
