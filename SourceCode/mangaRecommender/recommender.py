import json
import base64
import mysql.connector
import sys
import math
import numpy as np
np.set_printoptions(suppress=True)

ratingMap = {5: 'likes', 4: 'interested', 3: 'neutral', 2: 'dislikes', 1: 'not-interested'}
def convertRating(ratingTuple):
    mangaId = ratingTuple[2]
    status = ratingTuple[3]
    originalRating = ratingTuple[4]

    if originalRating is not None:
        if originalRating >= 7:
            return mangaId, 5
        if originalRating >= 5:
            return mangaId, 3
        else:  # if rating < 5
            return mangaId, 2
    if status == 'reading' or status == 'completed':
        return mangaId, 4
    if status == 'plan_to_read':
        return mangaId, 4
    if status == 'on_hold':
        return mangaId, 3
    if status == 'dropped':
        return mangaId, 2
    # list of assumptions: if you finished it you liked it
    # if you are reading it or plan to read it you are interested in it
    # if you rated it we map that into liked, disliked, neutral
    # on hold maps to neutral (we cannot make any assumptions with on hold imo so neutral is best)
    # dropped maps to disliked since we assume there was something you disliked about it that caused you to drop it

def satisfiesFilters(manga, filters):
    # if I want include check for include exclude overlap
    if not (filters[0][0] <= manga[1] <= filters[0][1]):
        return False  # popularity
    if manga[2] is not None:
        if not (filters[1][0] <= manga[2] <= filters[1][1]):
            return False  # releaseDate
    if manga[3] is not None:
        if not (filters[2][0] <= manga[3] <= filters[2][1]):
            return False  # chapterCount
    for i in range(len(filters[3])):
        if filters[3][i] is True and manga[4+i] == 1:
            return False  # exclude status
    for i in range(len(filters[4])):
        if filters[4][i] is True and manga[8+i] == 0:
            return False  # include genre
    for i in range(len(filters[5])):
        if filters[5][i] is True and manga[26+i] == 0:
            return False  # include theme
    for i in range(len(filters[6])):
        if filters[6][i] is True and manga[77+i] == 0:
            return False  # include demographic
    for i in range(len(filters[7])):
        if filters[7][i] is True and manga[8+i] == 1:
            return False  # exclude genre
    for i in range(len(filters[8])):
        if filters[8][i] is True and manga[26+i] == 1:
            return False  # exclude theme
    for i in range(len(filters[9])):
        if filters[9][i] is True and manga[77+i] == 1:
            return False  # exclude demographic
    return True

def getStatusSet():
    return ['On Hiatus', 'Finished', 'Publishing', 'Discontinued']

def getGenreSet():
    return ['Adventure', 'Comedy', 'Slice of Life', 'Boys Love', 'Sci-Fi', 'Action', 'Horror', 'Suspense', 'Girls Love', 'Gourmet', 'Sports', 'Avant Garde', 'Supernatural', 'Fantasy', 'Romance', 'Ecchi', 'Drama', 'Mystery']

def getThemeSet():
    return ['Historical', 'Time Travel', 'Visual Arts', 'Military', 'Love Polygon', 'Mecha', 'Martial Arts', 'Racing', 'Samurai', 'Strategy Game', 'CGDCT', 'Mythology', 'High Stakes Game', 'Idols (Male)', 'Reincarnation', 'Pets', 'Team Sports', 'Workplace', 'Isekai', 'Gag Humor', 'Memoir', 'Harem', 'Villainess', 'Detective', 'Performing Arts', 'Reverse Harem', 'Childcare', 'Otaku Culture', 'Mahou Shoujo', 'Anthropomorphic', 'Survival', 'Magical Sex Shift', 'Music', 'Delinquents', 'Organized Crime', 'Adult Cast', 'Medical', 'Showbiz', 'Crossdressing', 'Gore', 'Psychological', 'School', 'Combat Sports', 'Parody', 'Romantic Subtext', 'Space', 'Iyashikei', 'Video Game', 'Educational', 'Vampire', 'Super Power']

def getDemographicSet():
    return ['Kids', 'Seinen', 'Shoujo', 'Josei', 'Shounen']

def encodeManga(myCursor, manga, filters):
    mangaEncoded = []
    statusSet = getStatusSet()
    genreSet = getGenreSet()
    themeSet = getThemeSet()
    demographicSet = getDemographicSet()
    for mangaInstance in manga:
        # make fill release date for None type,
        # uses 2008 as fill for when release date is none. 2008 is average release data and there are only 100 manga...
        # with no release date
        # rn chapterCount is set to 0 if none, I dont like this but idk what else to do (avg is 40)
        instanceData = [mangaInstance[0], mangaInstance[1], mangaInstance[4] if mangaInstance[4] is not None else 2008,
                        mangaInstance[5] if mangaInstance[5] is not None else 40]

        mangaInstanceStatusSet = mangaInstance[6].replace("\"", "")
        for i in range(len(statusSet)):
            if statusSet[i] == mangaInstanceStatusSet:
                instanceData.append(1)
            else:
                instanceData.append(0)
        mangaInstanceGenreSet = mangaInstance[7].replace("\"", "").split('|') if mangaInstance[7] is not None else []
        for i in range(len(genreSet)):
            if genreSet[i] in mangaInstanceGenreSet:
                instanceData.append(1)
            else:
                instanceData.append(0)
        mangaInstanceThemeSet = mangaInstance[8].replace("\"", "").split('|') if mangaInstance[8] is not None else []
        for i in range(len(themeSet)):
            if themeSet[i] in mangaInstanceThemeSet:
                instanceData.append(1)
            else:
                instanceData.append(0)
        mangaInstanceDemographicSet = mangaInstance[9].replace("\"", "").split('|') if mangaInstance[9] is not None else []
        for i in range(len(demographicSet)):
            if demographicSet[i] in mangaInstanceDemographicSet:
                instanceData.append(1)
            else:
                instanceData.append(0)

        if satisfiesFilters(instanceData, filters):
            mangaEncoded.append(instanceData)
    return mangaEncoded

def cosineSimilarity(vector1, vector2):
    sumXX, sumXY, sumYY = 0, 0, 0
    for i in range(len(vector1)):
        X = vector1[i]
        Y = vector2[i]
        sumXX += X*X
        sumYY += Y*Y
        sumXY += X*Y
    return sumXY/math.sqrt(sumXX*sumYY)

def recommend(userId: int, filters):
    dataBase = mysql.connector.connect(
        host="washington.uww.edu",
        user="stremmeltr18",
        passwd=base64.b64decode(b'dHM1NjEy').decode("utf-8"),
        database="manga_rec"
    )
    myCursor = dataBase.cursor()

    #create one hot encoded (and other data alterations) matrix of movie table
    # possible include no_genres/no_themes column (i dont think it would be good but idk)
    myCursor.execute("select * from manga")
    manga = [x for x in myCursor]
    #0:id, 1:popularity, 2: releaseDate, 3:chapterCount, 4-7:status, 8-25:genre, 26-76:theme, 77-81:demographic
    mapping = ['id', 'popularity', 'releaseData', 'chapterCount'] + getStatusSet() + getGenreSet() + getThemeSet() + getDemographicSet()
    mangaEncoded = encodeManga(myCursor, manga, filters)
    ##print(manga[0])
    ##print(mangaEncoded[0])

    # get user's manga ratings
    myCursor.execute("select * from ratings where userId = %s", [userId])
    ratings = [x for x in myCursor]
    myCursor.close()
    convertedRatings = [convertRating(x) for x in ratings]
    ##print(convertedRatings)
    # #print('\n'.join([str(x) for x in convertedRatings]))

    #create table of encoded manga the user has rated
    userTable = []
    filteredRatings = []
    for i in range(len(convertedRatings)):
        for j in range(len(mangaEncoded)):
            if convertedRatings[i][0] == mangaEncoded[j][0]:  # only include manga that have not been filtered out
                userTable.append(mangaEncoded[j])  # [4:]only uses the one hot values for now
                filteredRatings.append(list(convertedRatings[i]))
                break
    #print('\n'.join([str(x) for x in userTable]))
    for i in range(len(manga)):
        manga[i] = list(manga[i])
        del manga[i][3]  # drop description for ease of viewing output
    #print('\n'.join([str(filteredRatings[x]) + str(manga[[i[0] for i in manga].index(filteredRatings[x][0])]) for x in range(len(filteredRatings))])) # HELPFUL
    #print('\n'.join([str(mangaEncoded[[i[0] for i in mangaEncoded].index(filteredRatings[x][0])]) for x in range(len(filteredRatings))])) # HELPFUL
    #print(userTable)

    #create a user preference vector (average or dot product of all user ratings)
    #userProfile = np.array(userTable).T.dot([i[1] for i in filteredRatings]) old way
    weightedTotal = [0] * len(userTable[0])  # aka number of features
    featureCounts = [0] * len(userTable[0])
    for i in range(len(userTable)):
        for j in range(len(userTable[i])):
            if userTable[i][j] is not None:
                weightedTotal[j] += userTable[i][j] * filteredRatings[i][1]
                featureCounts[j] += filteredRatings[i][1]
    userProfile = [0] * len(userTable[0])
    for i in range(len(weightedTotal)):
        userProfile[i] = (weightedTotal[i] / featureCounts[i]) if featureCounts != 0 else 0

    #print(dict(zip(mapping, userProfile)))  # HELPFUL
    #print([i[1] for i in filteredRatings])
    ##print(', '.join([str(x) for x in userProfile]))
    #print(userProfile)
    ##print(userProfile.shape)

    # create recommendations
    mangaIds = [0] * len(mangaEncoded)  # used to get ids back
    for i in range(len(mangaEncoded)):
        mangaIds[i] = mangaEncoded[i][0]
    # next 2 lines remove id for similarity calculation (it is not a feature) I will now try to remove them when sending the vectors to the cosign function
    #userProfile = userProfile[1:]
    #mangaEncoded = np.delete(np.array(mangaEncoded), np.s_[0:1], axis=1)
    # similarityMeasures = ((np.array(mangaGenreTable) * userProfile).sum(axis=1))/(np.array(userProfile).sum()) old way
    similarityMeasures = np.zeros(shape=(len(mangaEncoded), 2))  # I think this is the right size
    mangaVectors = [mangaEncoded[i][1:] for i in range(len(mangaEncoded))]
    userVector = userProfile[1:]
    for i in range(len(similarityMeasures)):
        similarityMeasures[i][0] = mangaEncoded[i][0]
        similarityMeasures[i][1] = cosineSimilarity(userVector, mangaVectors[i])
    #print(similarityMeasures)
    similarityMeasures = similarityMeasures[similarityMeasures[:, 1].argsort()[::-1]]  # sort similarityMeasures
    #print(similarityMeasures) # HELPFUL
    # recommendations = np.zeros(shape=(similarityMeasures.shape[0], 2))
    # for i in range(len(similarityMeasures)):
    #     recommendations[i][0] = mangaIds[i]  # get id back. works cuz order of manga is unchanged
    #     recommendations[i][1] = similarityMeasures[i]
    # print(recommendations.shape)
    # print(recommendations[9000:9010])
    # #print(recommendationTable[0:10])
    # recommendations = recommendations[recommendations[:, 1].argsort()[::-1]]  # sort recommendations
    #recommendations = recommendations[recommendations[:, 1].argsort()]
    # *********** recommendations were actually ok in reverse sorted order
    #print(recommendations[0:10])
    ##print('\n'.join([str(manga[[i[0] for i in manga].index(recommendations[x][0])]) for x in range(len(recommendations[0:10]))
    ##                 if recommendations[x][0] not in [i[0] for i in userTable]]))
    #get the manga rows that were recommended (and exclude those the user has already rated)
    recommendedManga = []
    ratedMangaIds = [i[0] for i in filteredRatings]
    for i in range(len(similarityMeasures)):
        if len(recommendedManga) >= 20:
            break
        for j in manga:
            if similarityMeasures[i][0] == j[0] and j[0] not in ratedMangaIds:
                recommendedManga.append(j)
    #old way bellow
    #recommendedManga = [manga[[i[0] for i in manga].index(recommendations[x][0])] for x in range(len(recommendations))
    #                    if not int(recommendations[x][0]) in [i[0] for i in filteredRatings]][0:20]
    #print('\n'.join([str(x) for x in recommendedManga]))  # HELPFUL
    # return list of json with manga info for the highest scored recommendations
    #results = [json.dumps({"id": x[0], "title": x[2][1:-1], "pictureLink": x[9][1:-2]}) for x in recommendedManga[0:20]]

    results = []
    for x in recommendedManga:
        results.append({"id": x[0], "title": x[2], "pictureLink": x[9]})
    return json.dumps(results)


callFromNode = True
includeAll = [[1, 27691], [1946, 2022], [1, 6477],
              [False] * 4, [False] * 18, [False] * 51, [False] * 5, [False] * 18, [False] * 51, [False] * 5]
testFilter = [[1, 1000], [2005, 2011], [1, 33],
              [True, False, True, True], [False] * 18, [False] * 51, [False] * 5, [False] * 18, [False] * 51, [False] * 5]
jsonTestFilter = "[[1,27691],[1946,1999],[1,6477],[false,true,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false]]"
jsonTestFilter2 = "[[1, 1000],[2005, 2011],[1, 33],[false,true,false,false],[true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false]]"
jsonTestFilter3 = "[[1,27691],[1946,1999],[1,6477],[false,false,false,false],[false,true,false,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false]]"
if callFromNode:
    uId = int(sys.argv[1])
    filtersIn = sys.argv[2]
    filtersIn = json.loads(filtersIn)

    print(recommend(uId, filtersIn))
    sys.stdout.flush()
else:
    #print(recommend(10, testFilter))
    print(recommend(17441, includeAll))  # me
    #print(recommend(1, testFilter))