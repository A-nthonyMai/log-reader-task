import { expect, test } from '@jest/globals'
import { printLoggingDetails, generateLoggingDetails, addToMapOrIncreaseCount, fetchIpAddressFromLine, fetchUrlFromLine, fetchTopThreeValues } from '../log-reader.js'

test('Should add new key to map', () => {
    const testMap = new Map();
    const newKey = 'NewKey';
    
    addToMapOrIncreaseCount(newKey, testMap);
    expect(testMap.get(newKey)).toBe(1);
})

test('Should increase existing map count by 1', () => {
    const testMap = new Map();
    const keyName = 'existingKey';
    
    testMap.set(keyName, 9);
    addToMapOrIncreaseCount(keyName, testMap);
    expect(testMap.get(keyName)).toBe(10);
})

test('Should return IP address', () => {
    const testLine = '168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0';
    const ipAddress = fetchIpAddressFromLine(testLine);
    expect(ipAddress).toBe('168.41.191.40');
})

test('Should not return an IP Address', () => {
    const testLine = `- - [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0`;
    const ipAddress = fetchIpAddressFromLine(testLine);
    expect(ipAddress).toBe(null);
})

test('Should return a URL', () => {
    const testLine = '168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0';
    const url = fetchUrlFromLine(testLine);
    expect(url).toBe('http://example.net');
})

test('Should not return a URL', () => {
    const testLine = '168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET /example/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0';
    const url = fetchUrlFromLine(testLine);
    expect(url).toBe(null);
})

test('Should return correct number of unique IP address', () => {
    const ipAddresses = new Map();
    const emptyMap = new Map();
    ipAddresses.set('1.1.1.1', 1)
    ipAddresses.set('2.2.2.2', 1)
    ipAddresses.set('3.3.3.3', 1)
    ipAddresses.set('4.4.4.4', 1)

    const loggingInfo = generateLoggingDetails(ipAddresses, emptyMap)
    expect(loggingInfo.uniqueIpAddressCount).toEqual(4)
})

test('Should return top three values', () => {
    const testMap = new Map()
    testMap.set('A', 10)
    testMap.set('B', 9)
    testMap.set('C', 9)
    testMap.set('D', 8)
    const topThreeValues = fetchTopThreeValues(testMap)

    const expectedArray = [['A', 10], ['B', 9], ['C', 9]]
    expect(topThreeValues).toEqual(expectedArray)
})