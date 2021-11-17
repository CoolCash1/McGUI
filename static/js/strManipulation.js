// Credit: Tim Down (https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript)

function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        console.log('Search String does not contain anything!')
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    console.log('OK')
    return indices;
}

// End Credit

function cutStr(str, cutStart, cutEnd) {
    return str.substring(0, cutStart) + str.substring(cutEnd + 1);
}

function insertStr(str, index, stringToAdd) {
    return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}