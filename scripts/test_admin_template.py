from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    
    page.goto('http://localhost:5174/')
    page.wait_for_load_state('networkidle')
    
    console_logs = []
    page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
    
    page.wait_for_timeout(2000)
    
    page.screenshot(path='/tmp/admin-login.png', full_page=False)
    
    content = page.content()
    
    print("=== Page Title ===")
    print(page.title())
    
    print("\n=== Console Errors ===")
    errors = [log for log in console_logs if 'error' in log.lower()]
    for err in errors:
        print(err)
    
    print("\n=== Page Structure ===")
    buttons = page.locator('button').all()
    inputs = page.locator('input').all()
    print(f"Buttons found: {len(buttons)}")
    print(f"Inputs found: {len(inputs)}")
    
    for btn in buttons[:5]:
        try:
            print(f"  Button: {btn.text_content()}")
        except:
            pass
    
    for inp in inputs[:5]:
        try:
            print(f"  Input: {inp.get_attribute('placeholder')}")
        except:
            pass
    
    browser.close()
