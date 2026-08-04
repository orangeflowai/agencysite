import imageUrlBuilder from '@sanity/image-url';
import { createClient } from 'next-sanity';
import { projectId, dataset, apiVersion } from '@/sanity/env';

const client = createClient({ projectId, dataset, apiVersion, useCdn: true });
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
    if (!source) return { width: () => ({ url: () => '' }), url: () => '' };
    return builder.image(source);
}
