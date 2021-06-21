const lineReader = require('line-reader');

const generateLoggingDetails = (ipAddressAndCountMap, urlAndCountMap) => {
    const loggingInfo = {
        uniqueIpAddressCount: ipAddressAndCountMap.size,
        topThreeVisitedURLs: [],
        topThreeActiveIpAddresses: [],
    }

    const sortedMapOfURLs = sortMapInDescendingOrder(urlAndCountMap)
    const sortedMapOfIpAddresses = sortMapInDescendingOrder(ipAddressAndCountMap)

    loggingInfo['topThreeVisitedURLs'] = fetchTopThreeValues(sortedMapOfURLs)
    loggingInfo['topThreeActiveIpAddresses'] = fetchTopThreeValues(sortedMapOfIpAddresses)

    return loggingInfo;
};

const sortMapInDescendingOrder = (map) => {
    const sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    return sortedMap;
}

const fetchTopThreeValues = (map) => {
    const topThreeValues = []

    if (map.size > 0) {
        const maxSize = map.size < 3 ? map.size : 3

        for(let i = 0; i < maxSize; i++) {
            const formattedString = ` ${[...map][i][0]}, Count: ${[...map][i][1]}`
            topThreeValues.push(formattedString)
        }
    }
    return topThreeValues
}

// Generic function to add key to map if it doesn't exist
// or increase the key's value by 1 if it does exist
const addToMapOrIncreaseCount = (key, map) => {
    if (key) {
        if (map.has(key)) {
            map.set(key, map.get(key) + 1);
        }
        else {
            map.set(key, 1);
        }
    }

    return map
}

const fetchIpAddressFromLine = (line) => {
    const ipRegExp = new RegExp(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/gi);
    return line.match(ipRegExp) ? line.match(ipRegExp)[0] : null;
}

const fetchUrlFromLine = (line) => {
    const urlRegExp = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/);
    return line.match(urlRegExp) ? line.match(urlRegExp)[0] : null;
}

const printLoggingDetails = ({ uniqueIpAddressCount, topThreeVisitedURLs, topThreeActiveIpAddresses }) => {
    console.log(`Number of unique IP Addresse: ${uniqueIpAddressCount}`)
    console.log(`Top three most visited URLs: ${topThreeVisitedURLs}`)
    console.log(`Top three most active IP addresses: ${topThreeActiveIpAddresses}`)
}

const readLogFile = (pathToFile = '') => {
    const ipAddressAndCount = new Map();
    const urlAndCount = new Map();

    lineReader.eachLine(pathToFile, (line, lastLine) => {
        const ipAddress = fetchIpAddressFromLine(line);
        addToMapOrIncreaseCount(ipAddress, ipAddressAndCount);

        const url = fetchUrlFromLine(line);
        addToMapOrIncreaseCount(url, urlAndCount)

        if (lastLine) {
            const loggedInfo = generateLoggingDetails(ipAddressAndCount, urlAndCount)
            printLoggingDetails(loggedInfo)
        }
    })
};

readLogFile(process.argv[2])

module.exports = {
    readLogFile,
    generateLoggingDetails,
    addToMapOrIncreaseCount,
    fetchIpAddressFromLine,
    fetchUrlFromLine,
    sortMapInDescendingOrder,
    fetchTopThreeValues,
    printLoggingDetails
};