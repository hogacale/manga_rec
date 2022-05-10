import sys
import json
import time
import requests
import mysql.connector
import base64

def maxRatingId_plus1(myCursor):
    myCursor.execute("select max(ratingId) from ratings;")
    maxId = myCursor.fetchall()[0][0]
    return maxId + 1

def getMangaDict(myCursor):
    myCursor.execute("select id, title from manga;")
    manga = myCursor.fetchall()
    manga_dict = {}
    for row in manga:
        # manga title = manga id
        manga_dict[row[1]] = row[0]
    return manga_dict

def addUserToDB(myCursor, userId, username):
    myCursor.execute("insert into users (userId, username, password) values (%s, %s, %s);",
                     [userId, username, "password"])

def addRatings(username, userId):
    dataBase = mysql.connector.connect(
        host="washington.uww.edu",
        user="stremmeltr18",
        passwd=base64.b64decode(b'dHM1NjEy').decode("utf-8"),
        database="manga_rec"
    )
    myCursor = dataBase.cursor()
#     print(userId)
    ratingId = maxRatingId_plus1(myCursor)
#     print(ratingId)
    mangaDict = getMangaDict(myCursor)
    looping = True
    nextPage = ""
    url = f'https://api.myanimelist.net/v2/users/{username}/mangalist?fields=list_status&limit=1000'
    while looping:
        # print('Requesting', url)
        userResponse = requests.get(url, headers={"X-MAL-CLIENT-ID": "1b4d2dde3c1f15b77e580ea5b337a8ce"})
#         print(userResponse.json())
        for keys, values in userResponse.json().items():
            for value in values:
                if keys == "data":
                    title = value["node"]["title"]
                    while '\"' in title:
                        title = title.replace('\"', '“', 1).replace('\"', '”', 1)
                    mangaStatus = value["list_status"].get("status")
                    if not mangaStatus:
                        mangaStatus = "None"  # yes it should be a string here.
                    mangaScore = value["list_status"]["score"]
                    if mangaScore == 0:
                        mangaScore = None  # gets converted to null when added to db

                    #writeRatingFile(rating_id, user_id, mangaTitle, mangaStatus, mangaScore)
                    if title in mangaDict:
                        # print([ratingId, userId, mangaDict[title], title, mangaStatus, mangaScore])
                        myCursor.execute("insert into ratings (ratingId, userId, mangaId, status, rating) "
                                         "values (%s, %s, %s, %s, %s);",
                                         [ratingId, userId, mangaDict[title], mangaStatus, mangaScore])
                        ratingId += 1
                if keys == "paging":
                    if not values.get("next"):
                        looping = False
                    else:
                        nextPage = values.get("next")
                        # print("Going to next page", nextPage)
                        url = nextPage
                        time.sleep(0.8)
        if not nextPage:
            looping = False
    dataBase.commit()
    return "success"


callFromNode = True
if callFromNode:
    usernameIn = sys.argv[1]
    userIdIn = int(sys.argv[2])
    # addRatings(usernameIn, userIdIn)
    print(addRatings(usernameIn, userIdIn))
    sys.stdout.flush()
else:
    print(addRatings("ChewingKeyboards", 17444))  # me
