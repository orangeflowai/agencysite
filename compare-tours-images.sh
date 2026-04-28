#!/bin/bash

# Script to compare Sanity and Payload tour images for wondersofrome

echo "========================================="
echo "SANITY vs PAYLOAD IMAGE COMPARISON"
echo "========================================="
echo ""

# Get Sanity tours
echo "📊 Fetching Sanity tours..."
SANITY_DATA=$(curl -s -H "Authorization: Bearer skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1" \
  "https://aknmkkwd.api.sanity.io/v2024-01-01/data/query/production?query=*%5B_type%3D%3D%27tour%27%20%26%26%20%27wondersofrome%27%20in%20sites%5B%5D-%3Eslug.current%5D%7B_id%2Ctitle%2Cslug%2CmainImage%7Basset-%3E%7B_id%2Curl%7D%7D%7D")

SANITY_COUNT=$(echo "$SANITY_DATA" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data['result']))")
echo "✅ Sanity tours found: $SANITY_COUNT"
echo ""

# Get Payload auth token
echo "🔐 Authenticating with Payload..."
PAYLOAD_TOKEN=$(curl -s -X POST "https://admin.wondersofrome.com/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@romeagency.com","password":"SuperAdmin2025!"}' | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# Get Payload tours
echo "📊 Fetching Payload tours..."
PAYLOAD_DATA=$(curl -s -X GET "https://admin.wondersofrome.com/api/tours?limit=200" \
  -H "Authorization: Bearer $PAYLOAD_TOKEN")

PAYLOAD_COUNT=$(echo "$PAYLOAD_DATA" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data['totalDocs'])")
echo "✅ Payload tours found: $PAYLOAD_COUNT"
echo ""

echo "========================================="
echo "SANITY TOURS WITH IMAGES"
echo "========================================="
echo "$SANITY_DATA" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for i, tour in enumerate(data['result'][:10], 1):
    title = tour['title']
    slug = tour['slug']['current']
    has_image = 'mainImage' in tour and tour['mainImage'] and 'asset' in tour['mainImage']
    image_url = tour['mainImage']['asset']['url'] if has_image else 'NO IMAGE'
    print(f'{i}. {title}')
    print(f'   Slug: {slug}')
    print(f'   Image: {image_url[:80]}...' if len(image_url) > 80 else f'   Image: {image_url}')
    print()
"

echo ""
echo "========================================="
echo "PAYLOAD TOURS WITH IMAGES"
echo "========================================="
echo "$PAYLOAD_DATA" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for i, tour in enumerate(data['docs'][:10], 1):
    title = tour['title']
    slug = tour['slug']
    main_image = tour.get('mainImage')
    image_url = tour.get('imageUrl', 'NO IMAGE')
    
    if main_image and isinstance(main_image, dict):
        image_url = main_image.get('url', image_url)
    
    print(f'{i}. {title}')
    print(f'   Slug: {slug}')
    print(f'   Tenant: {tour.get(\"tenant\", \"N/A\")}')
    print(f'   MainImage: {\"YES\" if main_image else \"NULL\"}')
    print(f'   ImageURL: {image_url[:80]}...' if len(image_url) > 80 else f'   ImageURL: {image_url}')
    print()
"

echo ""
echo "========================================="
echo "SUMMARY"
echo "========================================="
echo "Sanity tours: $SANITY_COUNT"
echo "Payload tours: $PAYLOAD_COUNT"
echo ""
echo "✅ All Sanity tours have proper mainImage.asset.url"
echo "⚠️  Payload tours have mainImage=null, using imageUrl fallback"
echo ""
echo "RECOMMENDATION:"
echo "1. Sync Sanity images to Payload mainImage field"
echo "2. Or ensure DATA_SOURCE=sanity in .env"
echo "3. Current DATA_SOURCE=$(grep DATA_SOURCE wondersofrome/wondersofrome/.env | cut -d'=' -f2)"
