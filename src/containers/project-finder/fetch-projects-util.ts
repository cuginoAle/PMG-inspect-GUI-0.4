import { headers } from 'next/headers';
async function fetchProjects() {
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host');
  if (!host) throw new Error('Unable to resolve host for internal fetch');
  const proto = h.get('x-forwarded-proto') || 'http';
  const url = `${proto}://${host}/protected/api/projects`;
  const auth = h.get('authorization');
  const res = await fetch(url, {
    cache: 'no-store',
    headers: auth ? { authorization: auth } : undefined,
  });
  if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
  const data = await res.json();
  return data.contents ?? [];
}

export { fetchProjects };
