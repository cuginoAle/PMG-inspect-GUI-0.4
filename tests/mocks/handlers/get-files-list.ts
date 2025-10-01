import projectList from '@/tests/mocks/stubs/project-list.json';
import { ApiHandler } from './types';

const getFilesListHandler: ApiHandler = {
  key: 'get_files_list',
  matches: (pathname) => pathname.endsWith('/get_files_list'),
  handle: async ({ route, url, bump }) => {
    bump('get_files_list');
    console.log('[TEST MOCK] Intercept get_files_list', {
      url: url.toString(),
    });
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(projectList),
    });
    return true;
  },
};

export default getFilesListHandler;
