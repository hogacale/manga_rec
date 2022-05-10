import csv

manga_cleaned = open("manga_results/manga_cleaned.csv", 'r', encoding='utf-8')
manga = csv.reader(manga_cleaned, delimiter='¶')
ratings_csv = open("manga_results/ratings.csv", 'r', encoding='utf-8')
ratings = csv.reader(ratings_csv, delimiter=',')
ratings_cleaned = open("manga_results/ratings_cleaned.csv", 'w', encoding='utf-8')

manga_dict = {}
for row in manga:
    if row[0] == "Id":
        continue
    manga_dict[row[2]] = row[0]

numUsableRatings = 0
numRatings = 0
for row in ratings:
    numRatings += 1
    if row[0] == 'ratingId':
        continue
    if row[2] not in manga_dict:
        continue
    numUsableRatings += 1
    lineToWrite = row[0] + "," + row[1] + ',' + manga_dict[row[2]] + ',' + row[3] + ',' + row[4] + '\n'
    ratings_cleaned.write(lineToWrite)


def addUserPassword():
    users_csv = open("manga_results/users.csv", 'r', encoding='utf-8')
    users = csv.reader(users_csv, delimiter=',')
    users_cleaned = open("manga_results/users_cleaned.csv", 'w', encoding='utf-8')
    for line in users:
        line2Write = line[0] + ",\"" + line[1] + "\"," + "password\n"
        users_cleaned.write(line2Write)


#addUserPassword()
# print(numUsableRatings)
# print(numRatings)
