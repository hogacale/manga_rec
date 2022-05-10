from bs4 import BeautifulSoup as soup
import os
import re

file_list = sorted(os.listdir("manga_pages/"), key=len)
# print(len(file_list))
startingMangaNum = 0
endMangaNum = len(file_list)


# print(file_list)

def pageScrap(file_path):
#     print(file_path)
    extracted_data = ''
    with open(file_path, 'r', encoding="utf-8") as file:
        page_html = file.read()
        page_soup = soup(page_html, "html.parser")

    #id = file_path[5:file_path.index('.')]
    Id = ''.join([s for s in file_path if s.isdigit()])
    #print(Id)
    extracted_data += Id + ','

    popularity = ''.join(page_soup.find("span", {"class": "numbers popularity"}).text.split())
    # results in "Popularity#xx"
    popularity = popularity[popularity.index('#') + 1:len(popularity)]
    # ^ from "Popularity#xx" to xx
    extracted_data += popularity + ','

    title = page_soup.find("span", {"itemprop": "name"})
    second_title = title.find(attrs={"class": "title-english"}).text if \
        title.find(attrs={"class": "title-english"}) is not None else ""
    # ^ some manga have an english title that is within the title tag.
    title = title.text.replace(second_title, "").strip()
    # ^ this removes that english title
    if title == '':
        title = page_soup.find("span", {"itemprop": "name"}).strip()
    # ^ in case the english title and og title are the same and nothing is left
    while '\"' in title:
        title = title.replace('\"', '“', 1).replace('\"', '”', 1)
    # ^ replaces quotes with different type of quote to avoid potential database problem
    extracted_data += '\"' + title + '\",'

    description = page_soup.find("span", {"itemprop": "description"}).text if \
        page_soup.find("span", {"itemprop": "description"}) is not None else ""
    description = description.strip().replace('  ', '').replace('\n', ' ')
    # ^ removes most whitespace and extra line breaks.
    while '\"' in description:
        description = description.replace('\"', '“', 1).replace('\"', '”', 1)
        # ^ may have problem if a description has a open " that is not closed
    # ^ replaces quotes with different type of quote to avoid potential database problem
    description = description.replace("[Written by MAL Rewrite]", '').strip()
    extracted_data += '\"' + description + '\",'

    info_container = page_soup.find("div", {"class": "leftside"})  # left side "information" side bar
    # ^ for releaseData, chapterCount, status, genre, theme, demographic

    release_date = ''
    release_date_tag = info_container.find("span", string=re.compile("Published:")).find_parent("div")
    release_date = re.findall("\d\d\d\d", release_date_tag.text)[0] if \
        len(re.findall("\d\d\d\d", release_date_tag.text)) != 0 else '-1'
    # ^ just gets the first year in the published tag
    extracted_data += release_date + ','

    chapter_count = info_container.find("span", string=re.compile("Chapters?:")).find_parent("div").text
    # could be "Chapters:" or "Chapter:"
    chapter_count = [s for s in chapter_count.split() if s.isdigit()]
    # ^ gets the number from the div tag's text
    chapter_count = chapter_count[0] if len(chapter_count) != 0 else '-1'
    extracted_data += chapter_count + ','

    status = info_container.find("span", string=re.compile("Status:")).find_parent("div").text
    status = status[status.index(':') + 1:len(status)].strip()
    # ^ from "Status: ssssss" to "ssssss"
    extracted_data += '\"' + status + '\",'

    genres = ''
    genre_tag = info_container.find("span", string=re.compile("Genres?:"))
    # could be "Genres:" or "Genre:" or not have any genres
    if genre_tag is not None:
        genre_list = genre_tag.find_parent("div").findAll('a')
        for genre in genre_list:
            genres += genre.text.strip() + "|"
        genres = genres[:-1]  # remove trailing |
        extracted_data += '\"' + genres + '\",'
    else:
        extracted_data += '\"' + "" + '\",'

    themes = ''
    theme_tag = info_container.find("span", string=re.compile("Themes?:"))
    # could be "Themes:" or "Theme:" or not have any themes
    if theme_tag is not None:
        theme_list = theme_tag.find_parent("div").findAll('a')
        for theme in theme_list:
            themes += theme.text.strip() + "|"
        themes = themes[:-1]  # remove trailing |
        extracted_data += '\"' + themes + '\",'
    else:
        extracted_data += '\"' + "" + '\",'

    demographics = ''
    demographic_tag = info_container.find("span", string=re.compile("Demographics?:"))
    # could be "Demographics:" or "Demographic:" or not have any demographics
    if demographic_tag is not None:
        demographic_list = demographic_tag.find_parent("div").findAll('a')
        for demographic in demographic_list:
            demographics += demographic.text.strip() + "|"
        demographics = demographics[:-1]  # remove trailing |
        extracted_data += '\"' + demographics + '\",'
    else:
        extracted_data += '\"' + "" + '\",'

    picture_link = ''
    try:
        picture_link = page_soup.find("div", {"class": "picSurround"}).find("img")["data-src"] if \
            page_soup.find("div", {"class": "picSurround"}) is not None else ''
        if picture_link[:53] != "https://cdn.myanimelist.net/r/42x62/images/characters":
            picture_link = ''
            # ^ if a non character img link was scraped then there are no characters
    except KeyError:
        picture_link = ''
    # try-except is for edge case where there are no characters and there is a img that has no "data-src" attribute
    extracted_data += '\"' + picture_link + '\"'

    #print(picture_link)
    return extracted_data


output_file = "manga_results/manga_updated.csv"
headers = "Id,Popularity,Title,Description,ReleaseDate,ChapterCount,Status,Genres,Theme,Demographic,PictureLink\n"
f = open(output_file, 'w', encoding='utf-8')
f.write(headers)

for x in range(startingMangaNum, endMangaNum):
    manga_data = pageScrap("manga_pages/{}".format(file_list[x]))
    f.write(manga_data + '\n')

f.close()
