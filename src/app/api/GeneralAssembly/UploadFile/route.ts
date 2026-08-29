import { NextResponse } from 'next/server';

function resolveBackendUrl(baseUrl: string, pathWithoutApiPrefix: string) {
  const trimmed = baseUrl.replace(/\/+$/, '');
  if (trimmed.endsWith('/api')) {
    return `${trimmed}${pathWithoutApiPrefix}`;
  }
  return `${trimmed}/api${pathWithoutApiPrefix}`;
}

export async function POST(req: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    return NextResponse.json({ message: 'NEXT_PUBLIC_API_URL is not configured' }, { status: 500 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ message: 'Invalid form data' }, { status: 400 });
  }

  const url = resolveBackendUrl(baseUrl, '/GeneralAssembly/UploadFile');

  const upstream = await fetch(url, {
    method: 'POST',
    headers: {
      ...(req.headers.get('authorization') ? { authorization: req.headers.get('authorization') as string } : {}),
    },
    body: formData,
    cache: 'no-store',
  });

  const contentType = upstream.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  }

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      'content-type': contentType || 'text/plain; charset=utf-8',
    },
  });
}
