import sys, httpx

BASE = "http://127.0.0.1:8000"

def main():
    r = httpx.get(f"{BASE}/api/health", timeout=5)
    print("Health:", r.status_code, r.json())
    login = httpx.post(f"{BASE}/api/auth/login", json={"email":"admin@azentmart.ai","password":"Admin@123"}, timeout=10)
    print("Login:", login.status_code, login.text)
    login.raise_for_status()
    token = login.json()["access_token"]
    h = {"Authorization": f"Bearer {token}"}
    for path in ["/api/dashboard/stats","/api/assistants/","/api/contacts/","/api/campaigns/","/api/call-logs/"]:
        x=httpx.get(BASE+path,headers=h,timeout=10)
        print(path, x.status_code)
        print(x.text[:500])
    print("Backend API test completed.")

if __name__ == "__main__":
    main()
