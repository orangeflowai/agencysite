import { createImageUrlBuilder } from '@sanity/image-url'
import { dataset, projectId } from '../env'

const imageBuilder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || '',
})

// Chainable stub for plain URL strings — mirrors the Sanity builder API
function stringUrlBuilder(src: string) {
    const stub: any = {
        url: () => src,
        width: () => stub,
        height: () => stub,
        fit: () => stub,
        auto: () => stub,
        quality: () => stub,
        format: () => stub,
    };
    return stub;
}

// Safe urlFor — handles both Sanity asset objects and plain URL strings
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => {
    if (!source) return stringUrlBuilder('');
    if (typeof source === 'string') return stringUrlBuilder(source);
    return imageBuilder.image(source);
}
