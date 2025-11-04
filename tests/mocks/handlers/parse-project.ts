import projectDetails from '@/tests/mocks/stubs/project-details.json';
import { ApiHandler } from './types';

const getProjectInventoryHandler: ApiHandler = {
  key: 'parse_project',
  matches: (pathname) => pathname.endsWith('/get_project_inventory'),
  handle: async ({ route, url, bump }) => {
    const rel = url.searchParams.get('project_relative_path');
    bump('parse_project');
    console.log('[TEST MOCK] Intercept get_project_inventory', {
      url: url.toString(),
      project_relative_path: rel,
    });
    if (!rel) {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          detail: [
            {
              type: 'missing',
              loc: ['query', 'project_relative_path'],
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

export default getProjectInventoryHandler;
