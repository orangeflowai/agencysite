import urllib.request, json, os

PAYLOAD_URL = "https://admin.wondersofrome.com/api/tours"
API_KEY = "oUXeNps-QPX_IA292tCbtHRFgi1oyuiGfd5WemTNeRE"

def check_tenant(tenant):
    print(f"\nChecking tenant: {tenant}")
    url = f"{PAYLOAD_URL}?where[tenant][equals]={tenant}&limit=100"
    req = urllib.request.Request(url, headers={"Authorization": f"users API-Key {API_KEY}"})
    try:
        with urllib.request.urlopen(req) as r:
            data = json.loads(r.read())
            docs = data.get("docs", [])
            print(f"Found {len(docs)} tours")
            for d in docs[:5]:
                print(f"  - {d['title']} ({d['slug']})")
    except Exception as e:
        print(f"Error checking {tenant}: {e}")

check_tenant("romewander")
check_tenant("vatican")
check_tenant("goldenrometour")
check_tenant("romanvaticantour")
