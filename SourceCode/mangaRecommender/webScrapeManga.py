import urllib.request as uReq
from bs4 import BeautifulSoup as soup
from urllib.parse import urlsplit, urlunsplit, quote
import time

startingMangaNum = 0
numMangaToScrape = 10000


class AppURLopener(uReq.FancyURLopener):
    version = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.37"

def iri2uri(iri):
    """
    Convert an IRI to a URI (Python 3).
    """
    uri = ''
    if isinstance(iri, str):
        (scheme, netloc, path, query, fragment) = urlsplit(iri)
        scheme = quote(scheme)
        netloc = netloc.encode('idna').decode('utf-8')
        path = quote(path)
        query = quote(query)
        fragment = quote(fragment)
        uri = urlunsplit((scheme, netloc, path, query, fragment))

    return uri

def pageScrap(startLimit):
    list_url = 'https://myanimelist.net/topmanga.php?type=manga&limit=' + str(startLimit)
    uClient = uReq.urlopen(list_url)
    Lpage_html = uClient.read()
    uClient.close()
    Lpage_soup = soup(Lpage_html, "html.parser")

    container = Lpage_soup.find('div', {"id": 'content'}).findAll('h3', {"class": "manga_h3"})

    manga_page_urls = []
    print(container)
    for i in range(0, 50):
        encodedURL = iri2uri(container[i].find('a')['href'])
        manga_page_urls.append(encodedURL)


    for i in range(len(manga_page_urls)):
        time.sleep(3)
        try:
            manga_page_url = manga_page_urls[i]
            print(manga_page_url)
            uClient = uReq.urlopen(manga_page_url)
            page_html = uClient.read()
            uClient.close()
            page_soup = soup(page_html, "html.parser")
            with open("manga_pages/manga{}.html".format(startLimit+i), 'w', encoding="utf-8") as file:
                file.write(page_soup.prettify())
        except:
            print("There was error opening url")
            continue


def saveMangaPage(url, rank):
    uClient = uReq.urlopen(url)
    page_html = uClient.read()
    uClient.close()
    page_soup = soup(page_html, "html.parser")
    with open("manga_pages/manga{}.html".format(rank), 'w', encoding="utf-8") as file:
        file.write(page_soup.prettify())



'''for x in range(startingMangaNum, numMangaToScrape, 50):
    pageScrap(x)'''

#saveMangaPage("https://myanimelist.net/manga/42391/Satou-kun_no_Juunan_Seikatsu", 2354)
