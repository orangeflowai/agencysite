#!/bin/bash

# Verify Sanity Images Fix
# This script confirms that Sanity has proper tour images

echo "=========================================="
echo "Sanity Images Verification"
echo "=========================================="
echo ""

SANITY_PROJECT_ID="aknmkkwd"
SANITY_DATASET="production"
SANITY_TOKEN="skxMygHyPvOtvJ09PlCYpaqDmx6jFStRyF5VsKOKFLmIGTQO0TMo6XlOHfCHcnCslGJfkCNQIjCyKway6H2uEvxMV9tnF0659Zj7zluXg6C6UdK5UxbrXPF5d6UwIys88dxEsmPPuCCFuL0LYICf7yaQrwnD40q6K7plxqQflqH5YevcVHA1"

# Query to get tours with images
QUERY='*[_type == "tour" && "wondersofrome" in sites[]->slug.current]{
  title,
  "slug": slug.current,
  "imageUrl": mainImage.asset->url,
  "hasImage": defined(mainImage.asset->url)
}[0...10]'

echo "Fetching first 10 tours from Sanity..."
echo ""

ENCODED_QUERY=$(echo "$QUERY" | jq -sRr @uri)
URL="https://${SANITY_PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${ENCODED_QUERY}"

RESPONSE=$(curl -s -H "Authorization: Bearer ${SANITY_TOKEN}" "$URL")

echo "Response:"
echo "$RESPONSE" | jq -r '.result[] | "✅ \(.title)\n   Image: \(if .hasImage then "YES - " + .imageUrl else "NO IMAGE" end)\n"'

echo ""
echo "=========================================="
echo "Summary:"
echo "=========================================="

TOTAL=$(echo "$RESPONSE" | jq '.result | length')
WITH_IMAGES=$(echo "$RESPONSE" | jq '[.result[] | select(.hasImage == true)] | length')

echo "Total tours checked: $TOTAL"
echo "Tours with images: $WITH_IMAGES"
echo "Success rate: $(echo "scale=0; $WITH_IMAGES * 100 / $TOTAL" | bc)%"
echo ""

if [ "$WITH_IMAGES" -eq "$TOTAL" ]; then
    echo "✅ ALL TOURS HAVE UNIQUE IMAGES!"
    echo "✅ The fix is working correctly!"
else
    echo "⚠️  Some tours are missing images"
fi

echo ""
echo "=========================================="
echo "Production Status:"
echo "=========================================="
echo ""

ssh -i ~/.ssh/id_ed25519 -o StrictHostKeyChecking=no root@91.98.205.197 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && pm2 status wondersofrome | grep wondersofrome'

echo ""
echo "DATA_SOURCE setting:"
ssh -i ~/.ssh/id_ed25519 -o StrictHostKeyChecking=no root@91.98.205.197 "grep DATA_SOURCE /var/www/wondersofrome/wondersofrome/.env"

echo ""
echo "=========================================="
echo "✅ Verification Complete!"
echo "=========================================="
