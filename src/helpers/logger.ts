import { Cache } from 'lib/indexeddb';

const logger = (log: {
  severity: 'info' | 'warning' | 'error';
  content: {
    source?: string;
    message: string;
  };
}) => {
  Cache.set('logs', Date.now().toString(), log);
};

export { logger };
