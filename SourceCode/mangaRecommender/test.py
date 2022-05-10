import csv
import mysql.connector
import json
import base64
'''count = 0
with open('manga_results/manga_cleaned.csv', encoding='utf-8') as csv_file_in:
    csv_reader = csv.reader(csv_file_in, delimiter=',')
    for row in csv_reader:
        count += 1
        #print(row)
        if len(row) != 11:
            print(len(row))

print(count)'''

def getColumnLengths():
    dataBase = mysql.connector.connect(
        host="washington.uww.edu",
        user="stremmeltr18",
        passwd=base64.b64decode(b'dHM1NjEy').decode("utf-8"),
        database="manga_rec"
    )
    myCursor = dataBase.cursor()
    # get user's manga ratings

    myCursor.execute("select min(popularity), max(popularity) from manga")
#     print("popularity min,max values:")
#     print([x for x in myCursor][0])

    myCursor.execute("select min(releaseDate), max(releaseDate) from manga")
#     print("releaseDate min,max values:")
#     print([x for x in myCursor][0])

    myCursor.execute("select min(chapterCount), max(chapterCount) from manga")
#     print("chapterCount min,max values:")
#     print([x for x in myCursor][0])

    myCursor.execute("select DISTINCT status from manga")
#     print("status values:")
#     print([x[0].replace("\"", "") for x in myCursor])

    myCursor.execute("select DISTINCT genre from manga")
#     print("genre values:")
    genreClumps = '|'.join([x[0].replace("\"", "") for x in myCursor if x[0] is not None])
    genreSet = set(genreClumps.split("|"))
#     print(genreSet)
#     print("genre count:", len(genreSet))

    myCursor.execute("select DISTINCT theme from manga")
#     print("theme values:")
    themeClumps = '|'.join([x[0].replace("\"", "") for x in myCursor if x[0] is not None])
    themeSet = set(themeClumps.split("|"))
#     print(themeSet)
#     print("theme count:", len(themeSet))

    myCursor.execute("select DISTINCT demographic from manga")
#     print("demographic values:")
    demographicClumps = '|'.join([x[0].replace("\"", "") for x in myCursor if x[0] is not None])
    demographicSet = set(demographicClumps.split("|"))
#     print(demographicSet)
#     print("demographic count:", len(demographicSet))


#getColumnLengths()