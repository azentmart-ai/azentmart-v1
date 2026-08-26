import requests
from bs4 import BeautifulSoup

def scrape_website_content(url: str) -> dict:
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.title.string.strip() if soup.title and soup.title.string else url

        for script in soup(["script", "style", "nav", "footer"]):
            script.extract()

        text = soup.get_text(separator=' ')
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        clean_text = '\n'.join(chunk for chunk in chunks if chunk)
        trimmed_content = clean_text[:15000] if len(clean_text) > 15000 else clean_text

        return {
            "title": title,
            "content": trimmed_content
        }
    except Exception as e:
        raise Exception(f"Failed to scrape URL: {str(e)}")