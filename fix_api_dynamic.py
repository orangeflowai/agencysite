import os

routes = [
    "wondersofrome/wondersofrome/src/app/api/addons/route.ts",
    "wondersofrome/wondersofrome/src/app/api/admin-setup/route.ts",
    "wondersofrome/wondersofrome/src/app/api/admin/addons/[id]/route.ts",
    "wondersofrome/wondersofrome/src/app/api/admin/addons/route.ts",
    "wondersofrome/wondersofrome/src/app/api/admin/inventory/route.ts",
    "wondersofrome/wondersofrome/src/app/api/ai/extract-keywords/route.ts",
    "wondersofrome/wondersofrome/src/app/api/ai/generate-blog/route.ts",
    "wondersofrome/wondersofrome/src/app/api/availability/route.ts",
    "wondersofrome/wondersofrome/src/app/api/book/route.ts",
    "wondersofrome/wondersofrome/src/app/api/checkout/route.ts",
    "wondersofrome/wondersofrome/src/app/api/contact/route.ts",
    "wondersofrome/wondersofrome/src/app/api/create-payment-intent/route.ts",
    "wondersofrome/wondersofrome/src/app/api/debug/inventory/route.ts",
    "wondersofrome/wondersofrome/src/app/api/debug/supabase/route.ts",
    "wondersofrome/wondersofrome/src/app/api/debug/tours/route.ts",
    "wondersofrome/wondersofrome/src/app/api/seed-addons/route.ts",
    "wondersofrome/wondersofrome/src/app/api/seed-inventory/route.ts",
    "wondersofrome/wondersofrome/src/app/api/seed-tours/route.ts",
    "wondersofrome/wondersofrome/src/app/api/seed-verified/route.ts",
    "wondersofrome/wondersofrome/src/app/api/tickets/[id]/route.ts",
    "wondersofrome/wondersofrome/src/app/api/webhooks/stripe/route.ts",
    "goldenrometour/src/app/api/addons/route.ts",
    "goldenrometour/src/app/api/admin-setup/route.ts",
    "goldenrometour/src/app/api/admin/addons/[id]/route.ts",
    "goldenrometour/src/app/api/admin/addons/route.ts",
    "goldenrometour/src/app/api/admin/inventory/route.ts",
    "goldenrometour/src/app/api/ai/extract-keywords/route.ts",
    "goldenrometour/src/app/api/ai/generate-blog/route.ts",
    "goldenrometour/src/app/api/availability/route.ts",
    "goldenrometour/src/app/api/book/route.ts",
    "goldenrometour/src/app/api/checkout/route.ts",
    "goldenrometour/src/app/api/contact/route.ts",
    "goldenrometour/src/app/api/create-payment-intent/route.ts",
    "goldenrometour/src/app/api/debug/inventory/route.ts",
    "goldenrometour/src/app/api/debug/supabase/route.ts",
    "goldenrometour/src/app/api/debug/tours/route.ts",
    "goldenrometour/src/app/api/seed-addons/route.ts",
    "goldenrometour/src/app/api/seed-inventory/route.ts",
    "goldenrometour/src/app/api/seed-tours/route.ts",
    "goldenrometour/src/app/api/tickets/[id]/route.ts",
    "goldenrometour/src/app/api/webhooks/stripe/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/addons/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/admin-setup/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/admin/addons/[id]/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/admin/addons/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/ai/extract-keywords/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/ai/generate-blog/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/availability/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/book/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/checkout/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/contact/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/create-payment-intent/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/debug/inventory/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/debug/supabase/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/debug/tours/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/seed-addons/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/seed-inventory/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/seed-tours/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/seed-verified/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/tickets/[id]/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/webhooks/stripe/route.ts",
    "ticketsinrome-copy/ticketsinrome/src/app/api/tours/route.ts",
    "romanvaticantour/src/app/api/addons/route.ts",
    "romanvaticantour/src/app/api/admin-setup/route.ts",
    "romanvaticantour/src/app/api/admin/addons/[id]/route.ts",
    "romanvaticantour/src/app/api/admin/addons/route.ts",
    "romanvaticantour/src/app/api/admin/inventory/route.ts",
    "romanvaticantour/src/app/api/ai/extract-keywords/route.ts",
    "romanvaticantour/src/app/api/ai/generate-blog/route.ts",
    "romanvaticantour/src/app/api/availability/route.ts",
    "romanvaticantour/src/app/api/book/route.ts",
    "romanvaticantour/src/app/api/checkout/route.ts",
    "romanvaticantour/src/app/api/contact/route.ts",
    "romanvaticantour/src/app/api/create-payment-intent/route.ts",
    "romanvaticantour/src/app/api/debug/inventory/route.ts",
    "romanvaticantour/src/app/api/debug/supabase/route.ts",
    "romanvaticantour/src/app/api/debug/tours/route.ts",
    "romanvaticantour/src/app/api/seed-addons/route.ts",
    "romanvaticantour/src/app/api/seed-inventory/route.ts",
    "romanvaticantour/src/app/api/seed-tours/route.ts",
    "romanvaticantour/src/app/api/tickets/[id]/route.ts",
    "romanvaticantour/src/app/api/webhooks/stripe/route.ts",
    "romewander/src/app/api/addons/route.ts",
    "romewander/src/app/api/admin-setup/route.ts",
    "romewander/src/app/api/admin/addons/[id]/route.ts",
    "romewander/src/app/api/admin/addons/route.ts",
    "romewander/src/app/api/admin/inventory/route.ts",
    "romewander/src/app/api/ai/extract-keywords/route.ts",
    "romewander/src/app/api/ai/generate-blog/route.ts",
    "romewander/src/app/api/availability/route.ts",
    "romewander/src/app/api/book/route.ts",
    "romewander/src/app/api/checkout/route.ts",
    "romewander/src/app/api/contact/route.ts",
    "romewander/src/app/api/create-payment-intent/route.ts",
    "romewander/src/app/api/debug/inventory/route.ts",
    "romewander/src/app/api/debug/supabase/route.ts",
    "romewander/src/app/api/debug/tours/route.ts",
    "romewander/src/app/api/seed-addons/route.ts",
    "romewander/src/app/api/seed-inventory/route.ts",
    "romewander/src/app/api/seed-tours/route.ts",
    "romewander/src/app/api/tickets/[id]/route.ts",
    "romewander/src/app/api/webhooks/stripe/route.ts"
]

dynamic_line = "export const dynamic = 'force-dynamic'\n"

for r in routes:
    if not os.path.exists(r):
        print(f"Skipping {r}")
        continue
    
    with open(r, 'r') as f:
        content = f.read()
    
    if "export const dynamic" in content:
        print(f"Already has dynamic in {r}")
        continue
    
    # Add after imports
    lines = content.splitlines()
    insert_idx = 0
    for i, line in enumerate(lines):
        if line.startswith("import"):
            insert_idx = i + 1
    
    lines.insert(insert_idx, "")
    lines.insert(insert_idx + 1, "export const dynamic = 'force-dynamic'")
    
    with open(r, 'w') as f:
        f.write("\n".join(lines) + "\n")
    print(f"Updated {r}")

