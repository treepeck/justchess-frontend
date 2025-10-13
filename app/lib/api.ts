const BASE_URL = 'http://localhost:3502';

export async function fetchSignup(params: URLSearchParams) {
  return await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    body: params,
  });
}
