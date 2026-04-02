// Minimal Sanity client without next-sanity dependency
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';
const token     = process.env.SANITY_API_TOKEN;

async function sanityFetch(query: string, params: Record<string, any> = {}, _options?: any) {
  const encodedQuery = encodeURIComponent(query);
  const paramStr = Object.entries(params)
    .map(([k, v]) => `&$${k}=${encodeURIComponent(JSON.stringify(v))}`)
    .join('');
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodedQuery}${paramStr}`;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status}`);
  const json = await res.json();
  return json.result;
}

async function sanityMutate(mutations: any[]) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) throw new Error(`Sanity mutate failed: ${res.status}`);
  return res.json();
}

async function sanityCreate(doc: any) {
  return sanityMutate([{ create: doc }]);
}

function sanityPatch(id: string) {
  return {
    set: (data: any) => ({
      commit: () => sanityMutate([{ patch: { id, set: data } }]),
      unset: (keys: string[]) => ({
        commit: () => sanityMutate([{ patch: { id, set: data, unset: keys } }]),
      }),
    }),
    unset: (keys: string[]) => ({
      commit: () => sanityMutate([{ patch: { id, unset: keys } }]),
    }),
  };
}

async function sanityUploadAsset(type: string, data: Buffer | File | Blob, opts: { filename?: string; contentType?: string } = {}) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/assets/${type}s/${dataset}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': opts.contentType || (data instanceof File ? data.type : 'application/octet-stream'),
      'Content-Disposition': `attachment; filename="${opts.filename || 'upload'}"`,
      Authorization: `Bearer ${token}`,
    },
    body: data as BodyInit,
  });
  if (!res.ok) throw new Error(`Asset upload failed: ${res.status}`);
  const json = await res.json();
  return json.document;
}

function sanityTransaction() {
  const mutations: any[] = [];
  const tx = {
    patch: (id: string, fn: (p: any) => any) => {
      const patchBuilder = {
        set: (data: any) => { mutations.push({ patch: { id, set: data } }); return patchBuilder; },
        setIfMissing: (data: any) => { mutations.push({ patch: { id, setIfMissing: data } }); return patchBuilder; },
        append: (field: string, items: any[]) => { mutations.push({ patch: { id, insert: { after: `${field}[-1]`, items } } }); return patchBuilder; },
      };
      fn(patchBuilder);
      return tx;
    },
    commit: () => sanityMutate(mutations),
  };
  return tx;
}

export const client = {
  fetch: sanityFetch,
  mutate: sanityMutate,
  create: sanityCreate,
  patch: sanityPatch,
  transaction: sanityTransaction,
  assets: { upload: sanityUploadAsset },
  projectId,
  dataset,
};
