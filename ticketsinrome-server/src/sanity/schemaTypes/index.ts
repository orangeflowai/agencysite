import { type SchemaTypeDefinition } from 'sanity'
import { tourType } from './tourType'
import { postType } from './postType'
import { settingsType } from './settingsType'
import { siteType } from './siteType'
import { addonType } from './addonType'
import { sightType } from './sightType'
import { productType } from './productType'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [siteType, tourType, sightType, productType, postType, settingsType, addonType],
}
