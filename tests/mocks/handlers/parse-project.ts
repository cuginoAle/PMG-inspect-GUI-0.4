import projectDetails from '@/tests/mocks/stubs/project-details.json';
import { ApiHandler } from './types';

const parseProjectHandler: ApiHandler = {
  key: 'parse_project',
  matches: (pathname) => pathname.endsWith('/parse_project'),
  handle: async ({ route, url, bump }) => {
    const rel = url.searchParams.get('relative_path');
    bump('parse_project');
    console.log('[TEST MOCK] Intercept parse_project', {
      url: url.toString(),
      relative_path: rel,
    });
    if (!rel) {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: [
            {
              type: 'missing',
              loc: ['query', 'relative_path'],
              msg: 'Field required',
              input: null,
            },
          ],
        }),
      });
      return true;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(projectDetails),
    });
    return true;
  },
};

export default parseProjectHandler;
