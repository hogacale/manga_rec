import urllib.request as uReq
from bs4 import BeautifulSoup as soup
import time

global counter
counter = 2100

class AppURLopener(uReq.FancyURLopener):
    version = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.37"

def pageScrap(startRank):
    list_url = 'https://myanimelist.net/topanime.php?limit=' + str(startRank)
    uClient = uReq.urlopen(list_url)
    Lpage_html = uClient.read()
    uClient.close()
    Lpage_soup = soup(Lpage_html, "html.parser")

    container = Lpage_soup.find('div', {"id": 'content'}).findAll('td', {"class": "title al va-t word-break"})

    anime_urls = []
    for x in range(0, 50):
        print(container[x].find('a')['href'])
        anime_urls.append(container[x].find('a')['href'])


    for x in range(len(anime_urls)):
        time.sleep(2)
        try:
            anime_url = anime_urls[x]
            uClient = uReq.urlopen(anime_url)
            Apage_html = uClient.read()
            uClient.close()
            Apage_soup = soup(Apage_html, "html.parser")
        except:
            print("There was error opening url (like due to non ascii character in link)")
            continue
        try:
            #It refers to the divs with the class 'spaceit'
            infoContainer = Apage_soup.find('div', {"style": "width: 225px"})
            infoContainerIt = infoContainer.findAll('div', {"class": "spaceit"})
            linkedInfo = infoContainer.find("h2").findAllNext('a')
            nonIt = infoContainer.find("h2").findAllNext('div', class_=None, id_=None)
            ItBackwords = infoContainer.findAll("h2")[2].findAllPrevious('div', class_='spaceit')

            Id = str(startRank + x)
            Title = Apage_soup.find('h1', {"class": "title-name h1_bold_none"}).text.strip().replace(",", '|')
            Type = linkedInfo[0].text.strip()
            Status = 'missing'
            if nonIt[1].text.strip()[:9].strip() == 'Status:':
                Status = nonIt[1].text.strip()[9:].strip()
            Aired = 'missing'
            if infoContainerIt[1].text.strip()[:6].strip() == "Aired:":
                Aired = infoContainerIt[1].text.strip()[6:].strip().replace(',', '')
            Episode_Count = 'missing'
            if infoContainerIt[0].text.strip()[:12].strip() == 'Episodes:':
                Episode_Count = infoContainerIt[0].text.strip()[12:].strip()
            Episode_Duration = 'missing'
            if ItBackwords[0].text.strip()[:9].strip() == 'Duration:':
                Episode_Duration = ItBackwords[0].text.strip()[9:].strip()
            Source = 'missing'
            if ItBackwords[1].text.strip()[:7].strip() == 'Source:':
                Source = ItBackwords[1].text.strip()[7:].strip()
            Average_Rating = infoContainer.find('span', {'itemprop': "ratingValue"}).text.strip()
            Views = 'missing'
            if infoContainerIt[-1].text.strip()[:8].strip() == 'Members:':
                Views = infoContainerIt[-1].text.strip()[8:].strip().replace(',', '')
            Favorites = 'missing'
            if infoContainer.findAll('div')[-2].text.strip()[:10].strip() == 'Favorites:':
                Favorites = infoContainer.findAll('div')[-2].text.strip()[10:].strip().replace(',', '')
            print(Title)
            print(Type)
            print(Status)
            print(Aired)
            print(Episode_Count)
            print(Episode_Duration)
            print(Source)
            print(Average_Rating)
            print(Views)
            print(Favorites)
            f.write(Id + ',' + Title + ',' + Type + ',' + Status + ',' + Aired + ',' + Episode_Count + ',' + Episode_Duration
                    + ',' + Source + ',' + Average_Rating + ',' + Views + ',' + Favorites + '\n')
        except:
            print("There was en error reading from this page")
            continue


filename = "TableA.csv"
headers = "ID,Title,Type,Status,Aired,Episode_Count,Episode_Duration,Source,Average_Rating,Views,Favorites\n"
f = open(filename, 'w')
f.write(headers)


for i in range(0, 100, 50):
    pageScrap(i)

f.close()


def pageScrap2(startPage):
    global counter
    list_url = 'https://www.anime-planet.com/anime/top-anime?page=' + str(startPage+1)
    opener = AppURLopener()
    uClient = opener.open(list_url)
    Lpage_html = uClient.read()
    uClient.close()
    Lpage_soup = soup(Lpage_html, "html.parser")

    container = Lpage_soup.findAll('td', {"class": 'tableTitle'})
    print(container)

    anime_urls = []
    for x in range(0, 35):
        try:
            print(container[x].find('a')['href'])
            anime_urls.append(container[x].find('a')['href'])
        except:
            print("has no link")


    for x in range(len(anime_urls)):
        time.sleep(.5)
        try:
            anime_url = 'https://www.anime-planet.com' + anime_urls[x]
            opener = AppURLopener()
            uClient = opener.open(anime_url)
            Apage_html = uClient.read()
            uClient.close()
            Apage_soup = soup(Apage_html, "html.parser")
        except:
            print("There was error opening url (like due to non ascii character in link)")
            continue

        try:
            counter += 1
            Id = str(counter)
            Title = Apage_soup.find('h1', {'itemprop': 'name'}).text.strip().replace(',', '')
            typeContainer = Apage_soup.find('span', {'class': 'type'}).text.split('\n')
            Type = typeContainer[0].strip()
            Status = 'missing'
            Aired = Apage_soup.find('span', {'class': 'iconYear'}).text.strip().replace(',', '')
            Episode_Count = typeContainer[1].strip()[1:].split(' ')[0].replace(',', '')
            Episode_Duration = 'missing'
            if typeContainer[1].strip().split(' ')[len(typeContainer[1].strip().split(' '))-1] == 'min)':
                Episode_Duration = typeContainer[1].strip().split(' ')[len(typeContainer[1].strip().split(' '))-2]

            tags = Apage_soup.find('div', {'class': 'tags'}).text.strip().split('\n')
            for tag in tags:
                if len(tag) == 0:
                    tags.remove(tag)
            Source = 'missing'
            if len(tags) != 0:
                if tags[-1][:10].lower().strip() == 'based on a':
                    Source = tags[-1][10:].strip()
                elif tags[-1].strip().lower() == 'original work':
                    Source = 'Original'

            Average_Rating = Apage_soup.find('div', {'class': 'avgRating'}).text.strip().split(' ')[0]
            #views = Apage_soup.find('span', {'class': 'slCount'})#.text.replace(',', '')
            Views = Apage_soup.find('div', {'class': 'avgRating'}).text.strip().split(' ')[-2].replace(',', '')
            Favorites = 'missing'

            print(Title)
            print(Type)
            #print(Status)
            print(Aired)
            print(Episode_Count)
            print(Episode_Duration)
            print(Source)
            print(Average_Rating)
            print(Views)
            f.write(
                Id + ',' + Title + ',' + Type + ',' + Status + ',' + Aired + ',' + Episode_Count + ',' + Episode_Duration
                + ',' + Source + ',' + Average_Rating + ',' + Views + ',' + Favorites + '\n')

        except:
            print("There was en error reading from this page")
            continue


filename = 'TableB.csv'
headers = "ID,Title,Type,Status,Aired,Episode_Count,Episode_Duration,Source,Average_Rating,Views,Favorites,\n"
f = open(filename, 'w')
f.write(headers)

for i in range(60, 90):
    pageScrap2(i)

f.close()
