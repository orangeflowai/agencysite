// Minimal Sanity image URL builder without @sanity/image-url dependency
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

function buildImageUrl(source: any, opts: { width?: number; height?: number; quality?: number; fit?: string } = {}) {
  if (!source) return '';

  // Already a full URL string
  if (typeof source === 'string' && source.startsWith('http')) {
    let url = source;
    const params: string[] = [];
    if (opts.width)   params.push(`w=${opts.width}`);
    if (opts.height)  params.push(`h=${opts.height}`);
    if (opts.quality) params.push(`q=${opts.quality}`);
    if (opts.fit)     params.push(`fit=${opts.fit}`);
    if (params.length) url += (url.includes('?') ? '&' : '?') + params.join('&');
    return url;
  }

  // Asset with direct URL
  if (source?.asset?.url) {
    let url = source.asset.url;
    const params: string[] = [];
    if (opts.width)   params.push(`w=${opts.width}`);
    if (opts.height)  params.push(`h=${opts.height}`);
    if (opts.quality) params.push(`q=${opts.quality}`);
    if (opts.fit)     params.push(`fit=${opts.fit}`);
    params.push('auto=format');
    url += (url.includes('?') ? '&' : '?') + params.join('&');
    return url;
  }

  // Asset reference
  const ref = source?.asset?._ref || (typeof source === 'string' ? source : '');
  if (!ref) return '';

  const match = ref.replace('image-', '').match(/^(.+)-(\d+x\d+)-(\w+)$/);
  if (!match) return '';
  const [, id, , format] = match;

  let url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${format}`;
  const params: string[] = [];
  if (opts.width)   params.push(`w=${opts.width}`);
  if (opts.height)  params.push(`h=${opts.height}`);
  if (opts.quality) params.push(`q=${opts.quality}`);
  if (opts.fit)     params.push(`fit=${opts.fit}`);
  params.push('auto=format');
  url += '?' + params.join('&');
  return url;
}

// Chainable builder
function createBuilder(source: any, opts: Record<string, any> = {}): any {
  return {
    width:   (w: number)  => createBuilder(source, { ...opts, width: w }),
    height:  (h: number)  => createBuilder(source, { ...opts, height: h }),
    quality: (q: number)  => createBuilder(source, { ...opts, quality: q }),
    fit:     (f: string)  => createBuilder(source, { ...opts, fit: f }),
    auto:    (_: string)  => createBuilder(source, opts),
    url:     ()           => buildImageUrl(source, opts),
  };
}

export function urlFor(source: any) {
  return createBuilder(source);
}
