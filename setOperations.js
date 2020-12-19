const axios = require('axios');

//TODO: return on catches
//A * B

//const getTracks = async function 
const intersection = async function (playlist_1, playlist_2, ACCESS_TOKEN, NAME) {
    const URIs = [];


    //TODO: Cache the playlist with the larger size to improve performace
    //add playlist_1 uris to set
    let songs = new Set();
    for (let item of playlist_1) {
        songs.add(item);
    }

    //loop over playlist 2 and if the track is in playlist 1, add it to the array of URIs
    for (let item of playlist_2) {
        if (songs.has(item))
            URIs.push(item);
    }

    return URIs;
}

// A + B
const union = async function (playlist_1, playlist_2, ACCESS_TOKEN, NAME) {
    const URIs = [];


    //TODO: Cache the playlist with the larger size to improve performace
    //TODO: Loop with a counter to reduce iterations
    //add playlist_1 uris to set
    let songs = new Set();
    for (let item of playlist_1) {
        songs.add(item);
        URIs.push(item)
    }

    //loop over playlist 2 and add tracks
    for (let item of playlist_2) {
        if (!songs.has(item))
            URIs.push(item);
    }

    return URIs;
}


//A - B
//everything in A that isn't in B
const difference = async function (playlist_1, playlist_2, ACCESS_TOKEN, NAME) {
    let URIs = [];


    //TODO: Cache the playlist with the larger size to improve performace
    //add playlist_1 uris to set
    let songs = new Set();
    for (let item of playlist_1) {
        songs.add(item);
    }

    //loop over playlist 2 and if the track is in playlist 1 delete it
    for (let item of playlist_2) {
        if (songs.has(item))
            songs.delete(item)
    }

    URIs = Array.from(songs);
    //assign URIs to the set


    return URIs;
}

//not (A intersection B)
const nand = async function (playlist_1, playlist_2, ACCESS_TOKEN, NAME) {
    let URIs = [];


    //TODO: Cache the playlist with the larger size to improve performace
    //add playlist_1 uris to set
    let songs = new Set();
    for (let item of playlist_1) {
        songs.add(item);
    }

    //loop over playlist 2 and remove elements that were found in playlist_1 and add elements that are unique to in playlist_2
    for (let item of playlist_2) {
        if (!songs.has(item))
            songs.add(item)
        else
            songs.delete(item)
    }

    URIs = Array.from(songs)
    return URIs;
}



module.exports.intersection = intersection;
module.exports.union = union;
module.exports.difference = difference;
module.exports.nand = nand;