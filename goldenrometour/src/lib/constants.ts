export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_BUCKET_URL = SUPABASE_URL
  ? `${SUPABASE_URL}/storage/v1/object/public/images`
  : '';
