import csv

popularityList = []
titleList = []
dupCounter = 0
output_file = "manga_results/manga_cleaned.csv"
f = open(output_file, 'w', encoding='utf-8')
output_file2 = "manga_results/manga_cleaned_csv.csv"
f2 = open(output_file2, 'w', encoding='utf-8')
with open('manga_results/manga_updated.csv', encoding='utf-8') as csv_file_in:
    csv_reader = csv.reader(csv_file_in, delimiter=',')
    for row in csv_reader:
        #print(row[9])
        if row[2] in titleList:
            #skip dub entry
            print(row[1])
            dupCounter += 1
            continue
        lineToWrite = row[0] + '¶' + row[1] + '¶' + '\"' + row[2] + '\"¶' + '\"' + row[3] + '\"¶'
        lineToWrite += row[4] + '¶' + row[5] + '¶' + '\"' + row[6] + '\"¶' + '\"' + row[7] + '\"¶'
        lineToWrite += '\"' + row[8] + '\"¶' + '\"' + row[9] + '\"¶' + '\"' + row[10] + '\"\n'
        f.write(lineToWrite)
        lineToWrite = row[0] + ',' + row[1] + ',' + '\"' + row[2] + '\",' + '\"' + row[3] + '\",'
        lineToWrite += row[4] + ',' + row[5] + ',' + '\"' + row[6] + '\",' + '\"' + row[7] + '\",'
        lineToWrite += '\"' + row[8] + '\",' + '\"' + row[9] + '\",' + '\"' + row[10] + '\"\n'
        f2.write(lineToWrite)
        popularityList.append(row[1])
        titleList.append(row[2])


# print(len(popularityList))
#print(titleList[popularityList.index(x)])
# print(len([x for x in popularityList if popularityList.count(x) > 1]))
# print(len([x for x in titleList if titleList.count(x) > 1]))
# print([x for x in titleList if titleList.count(x) > 1])
# print(dupCounter)
