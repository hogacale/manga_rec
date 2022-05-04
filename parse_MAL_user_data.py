import os
import random

import requests
import json
import time
path = r'D:\Users\marhog\Documents\SE\html\userPages'
filename_t1 = "_byt0.html"
filename_t2 = "_allen.html"
user_id = 1
rating_id = 1
save_path = r'D:\Users\marhog\Documents\SE\csv'
file_name_users = 'users.csv'
file_name_ratings = 'ratings.csv'
completePath = os.path.join(save_path, file_name_users)
users_file = open(completePath, "a", encoding='utf-8')
read_users_file = open(completePath, "r", encoding='utf-8')
completePath = os.path.join(save_path, file_name_ratings)
ratings_file = open(completePath, "a", encoding='utf-8')
read_ratings_file = open(completePath, "r", encoding='utf-8')
# users_file.write('ID,name\n')
# ratings_file.write('ratingId,userId,mangaName,status,rating\n')

def writeRatingFile(r_id,userId,mangaName,status,rating):
    ratings_file.write(str(r_id))
    ratings_file.write(',')
    ratings_file.write(str(userId))
    ratings_file.write(',')
    ratings_file.write(mangaName)
    ratings_file.write(',')
    ratings_file.write(status)
    ratings_file.write(',')
    ratings_file.write(str(rating))
    ratings_file.write('\n')

def writeUserFile(Id,name):
    users_file.write(str(Id))
    users_file.write(',')
    users_file.write(name)
    users_file.write('\n')

def replaceQuotes(str):
    nextQ = 0
    runTime = int(str.count("\"") / 2)
    for x in range(runTime):
        firstQ = str.find("\"",nextQ)
        str = str[:firstQ] + chr(0x201C) + str[firstQ + 1:]
        nextQ = str.find("\"", firstQ + 1)
        str = str[:nextQ] + chr(0x201D) + str[nextQ + 1:]
        nextQ += 1
    return str

read_users_file.readline()
for root, dirs, files in os.walk(path, topdown=False):
    username = ""
    for name in files:
        nextPage = ""
        looping = True
        username = name.split('.html')[0]
        # Check to ensure data doesn't exist
        if not read_users_file.closed:
            user_file_line = read_users_file.readline()
            if user_file_line:
                if user_file_line.split(",")[1][1:-2] == username:
                    print(username, "exists")
                    user_id += 1
                    continue
            rating_id = int(read_ratings_file.readlines()[-1].split(",")[0]) + 1
            if not read_users_file.closed:
                read_users_file.close()
            if not read_ratings_file.closed:
                read_ratings_file.close()
        # print(user_id,rating_id)
        # assert user_id == 934
        # This is where the important parts of the code begins
        print('Starting',username)
        # username is the username
        url = f'https://api.myanimelist.net/v2/users/{username}/mangalist?fields=list_status&limit=500'
        while looping:
            print('Requesting',url)
            userResponse = requests.get(url,
                              headers = {"X-MAL-CLIENT-ID" : "1b4d2dde3c1f15b77e580ea5b337a8ce"})
            for keys, values in userResponse.json().items():
                for value in values:
                    if keys == "data":
                        mangaTitle = "\""
                        mangaTitle += value["node"]["title"]
                        if "\"" in mangaTitle[1:]:
                            mangaTitle = "\"" + replaceQuotes(mangaTitle[1:])
                        mangaTitle += "\""
                        mangaStatus = value["list_status"].get("status")
                        if not mangaStatus:
                            mangaStatus = "None"
                        mangaScore = value["list_status"]["score"]
                        if mangaScore == 0:
                            mangaScore = "-1"
                        # print("Manga with title",mangaTitle,"added to",username,"ratings")
                        writeRatingFile(rating_id,user_id,mangaTitle,mangaStatus,mangaScore)
                        rating_id += 1
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
        print("User",username,"added to csv")
        username = "\"" + username + "\""
        writeUserFile(user_id,username)
        time.sleep((random.random() * 2) + 2)
        user_id += 1
users_file.close()
ratings_file.close()
