import { http, HttpResponse } from 'msw';
import { ENDPOINT } from '@/src/constants/api-end-points';
import projectList from './stubs/project-list.json';

export const handlers = [
  http.get(ENDPOINT.PROJECT.LIST, () => {
    return HttpResponse.json(projectList, { status: 200 });
  }),
];
