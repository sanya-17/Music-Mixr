const axios = require('axios');
//A * B
const intersection = async function (playlist_1, playlist_2, ACCESS_TOKEN, NAME) {
    const URIs = [];


    //TODO: Cache the playlist with the larger size to improve performace
    //add playlist_1 uris to set
    let songs = new Set();
    for (let item of playlist_1.tracks.items) {
        songs.add(item.track.uri);
    }

    //loop over playlist 2 and if the track is in playlist 1, add it to the array of URIs
    for (let item of playlist_2.tracks.items) {
        if (songs.has(item.track.uri))
            URIs.push(item.track.uri);
    }

    console.log(URIs);


    //create new playlist
    //fetch the current users id first, then create the playlist
    //axios was tweaking: https://stackoverflow.com/questions/59575400/getting-request-failed-with-status-code-401-error-when-trying-to-create-a-play
    try {
        //fetch id
        let user = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
        });
        console.log(user.data);
        const { id } = user.data;
        const data = {
            name: NAME
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };

        var NEW_PLAYLIST = await axios.post(`https://api.spotify.com/v1/users/${id}/playlists`, data, config)
    }
    catch (e) {
        console.log(e);
        //do sumn else
        //res.redirect('/')
    }

    console.log("new playlist")
    console.log(NEW_PLAYLIST.data);
    const NEW_PLAYLIST_ID = NEW_PLAYLIST.data.id;

    const URL = NEW_PLAYLIST.data.external_urls.spotify;
    console.log(NEW_PLAYLIST_ID);
    console.log(URL);

    //TODO: Destructure Object to get external URL and other necessary fields


    //add tracks to new playlist

    try {
        const data = {
            uris: URIs
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };

        const result = axios.post(`https://api.spotify.com/v1/playlists/${NEW_PLAYLIST_ID}/tracks`, data, config)
        return NEW_PLAYLIST.data;
    }
    catch (e) {
        console.log(e);
        //do sumn else
        //res.redirect('/');
    }
}

// A + B
const union = async function (playlist_1, playlist_2, ACCESS_TOKEN, NAME) {
    const URIs = [];


    //TODO: Cache the playlist with the larger size to improve performace
    //TODO: Loop with a counter to reduce iterations
    //add playlist_1 uris to set
    let songs = new Set();
    for (let item of playlist_1.tracks.items) {
        songs.add(item.track.uri);
        URIs.push(item.track.uri)
    }

    //loop over playlist 2 and add tracks
    for (let item of playlist_2.tracks.items) {
        if (!songs.has(item.track.uri))
            URIs.push(item.track.uri);
    }

    console.log(URIs);


    //create new playlist
    //fetch the current users id first, then create the playlist
    //axios was tweaking: https://stackoverflow.com/questions/59575400/getting-request-failed-with-status-code-401-error-when-trying-to-create-a-play
    try {
        //fetch id
        let user = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
        });
        console.log(user.data);
        const { id } = user.data;
        const data = {
            name: NAME
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };

        var NEW_PLAYLIST = await axios.post(`https://api.spotify.com/v1/users/${id}/playlists`, data, config)
    }
    catch (e) {
        console.log(e);
        //do sumn else
        //res.redirect('/')
    }

    console.log("new playlist")
    console.log(NEW_PLAYLIST.data);
    const NEW_PLAYLIST_ID = NEW_PLAYLIST.data.id;

    const URL = NEW_PLAYLIST.data.external_urls.spotify;
    console.log(NEW_PLAYLIST_ID);
    console.log(URL);

    //TODO: Destructure Object to get external URL and other necessary fields


    //add tracks to new playlist

    try {
        const data = {
            uris: URIs
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };

        const result = axios.post(`https://api.spotify.com/v1/playlists/${NEW_PLAYLIST_ID}/tracks`, data, config)
        return NEW_PLAYLIST.data;
    }
    catch (e) {
        console.log(e);
        //do sumn else
        //res.redirect('/');
    }
}


//A - B
//everything in A that isn't in B
const difference = async function (playlist_1, playlist_2, ACCESS_TOKEN, NAME) {
    let URIs = [];


    //TODO: Cache the playlist with the larger size to improve performace
    //add playlist_1 uris to set
    let songs = new Set();
    for (let item of playlist_1.tracks.items) {
        songs.add(item.track.uri);
    }

    //loop over playlist 2 and if the track is in playlist 1 delete it
    for (let item of playlist_2.tracks.items) {
        if (songs.has(item.track.uri))
            songs.delete(item.track.uri)
    }

    URIs = Array.from(songs);
    //assign URIs to the set


    console.log(URIs);


    //create new playlist
    //fetch the current users id first, then create the playlist
    //axios was tweaking: https://stackoverflow.com/questions/59575400/getting-request-failed-with-status-code-401-error-when-trying-to-create-a-play
    try {
        //fetch id
        let user = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
        });
        console.log(user.data);
        const { id } = user.data;
        const data = {
            name: NAME
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };

        var NEW_PLAYLIST = await axios.post(`https://api.spotify.com/v1/users/${id}/playlists`, data, config)
    }
    catch (e) {
        console.log(e);
        //do sumn else
        //res.redirect('/')
    }

    console.log("new playlist")
    console.log(NEW_PLAYLIST.data);
    const NEW_PLAYLIST_ID = NEW_PLAYLIST.data.id;

    const URL = NEW_PLAYLIST.data.external_urls.spotify;
    console.log(NEW_PLAYLIST_ID);
    console.log(URL);

    //TODO: Destructure Object to get external URL and other necessary fields


    //add tracks to new playlist

    try {
        const data = {
            uris: URIs
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };

        const result = axios.post(`https://api.spotify.com/v1/playlists/${NEW_PLAYLIST_ID}/tracks`, data, config)
        return NEW_PLAYLIST.data;
    }
    catch (e) {
        console.log(e);
        //do sumn else
        //res.redirect('/');
    }
}

//not (A intersection B)
const nand = async function (playlist_1, playlist_2, ACCESS_TOKEN, NAME) {
    let URIs = [];


    //TODO: Cache the playlist with the larger size to improve performace
    //add playlist_1 uris to set
    let songs = new Set();
    for (let item of playlist_1.tracks.items) {
        songs.add(item.track.uri);
    }

    //loop over playlist 2 and remove elements that were found in playlist_1 and add elements that are unique to in playlist_2
    for (let item of playlist_2.tracks.items) {
        if (!songs.has(item.track.uri))
            songs.add(item.track.uri)
        else
            songs.delete(item.track.uri)
    }

    URIs = Array.from(songs)

    console.log(URIs);


    //create new playlist
    //fetch the current users id first, then create the playlist
    //axios was tweaking: https://stackoverflow.com/questions/59575400/getting-request-failed-with-status-code-401-error-when-trying-to-create-a-play
    try {
        //fetch id
        let user = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
        });
        console.log(user.data);
        const { id } = user.data;
        const data = {
            name: NAME
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };

        var NEW_PLAYLIST = await axios.post(`https://api.spotify.com/v1/users/${id}/playlists`, data, config)
    }
    catch (e) {
        console.log(e);
        //do sumn else
        //res.redirect('/')
    }

    console.log("new playlist")
    console.log(NEW_PLAYLIST.data);
    const NEW_PLAYLIST_ID = NEW_PLAYLIST.data.id;

    const URL = NEW_PLAYLIST.data.external_urls.spotify;
    console.log(NEW_PLAYLIST_ID);
    console.log(URL);

    //TODO: Destructure Object to get external URL and other necessary fields


    //add tracks to new playlist

    try {
        const data = {
            uris: URIs
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };

        const result = axios.post(`https://api.spotify.com/v1/playlists/${NEW_PLAYLIST_ID}/tracks`, data, config)
        return NEW_PLAYLIST.data;
    }
    catch (e) {
        console.log(e);
        //do sumn else
        //res.redirect('/');
    }
}



module.exports.intersection = intersection;
module.exports.union = union;
module.exports.difference = difference;
module.exports.nand = nand;