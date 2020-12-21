const axios = require('axios');

//sleep function
const sleep = function (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

//creates a new playlist and adds tracks given an Array of track URIs, an access token
//and a name for the new playlist
const newPlaylist = async function (URIs, ACCESS_TOKEN, NAME) {
    //extract first 100 song URIs because songs only 100 songs can be added at a time

    let current = URIs.slice(0, 100);
    //store the rest of the URIs

    let rest = URIs.slice(100);


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
        const data = {
            name: NAME
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        };

        var NEW_PLAYLIST = await axios.post(`https://api.spotify.com/v1/users/${user.data.id}/playlists`, data, config)
    }
    //dummy finally block. Exceptions will be caught in index.js
    finally {
    }

    const NEW_PLAYLIST_ID = NEW_PLAYLIST.data.id;

    const URL = NEW_PLAYLIST.data.external_urls.spotify;
    console.log(URL);

    do {
        //add the first 100 tracks to new playlist
        try {
            const data = {
                uris: current
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                }
            };

            axios.post(`https://api.spotify.com/v1/playlists/${NEW_PLAYLIST_ID}/tracks`, data, config)
            //set current to the the next 100 in rest
            current = rest.slice(0, 100);
            //set rest to what is after  after current
            rest = rest.slice(100);
        }
        //dummy finally block. Exceptions will be caught in index.js
        finally {
        } //while there are still songs left
    } while (current.length);


    //poll API to see if the playlist has been updated
    do {
        try {
            var playlist = await axios.get(`https://api.spotify.com/v1/playlists/${NEW_PLAYLIST_ID}`, {
                headers: {
                    'Authorization': 'Bearer ' + ACCESS_TOKEN
                },
                params: {
                    'fields': 'external_urls(spotify), name, images, tracks(total)'
                }
            })
            playlist = playlist.data;
        }
        //dummy finally block. Exceptions will be caught in index.js
        finally {
        }
    } //playlist has an image once there is >= 1 song
    while (!playlist.images[0]);

    //return the playlist object once updated
    return playlist;


    //ISSUE: ALthough I'm fetching the playlist after getting tracks, the API still says that the playlist is empty
    //I probably need to implement some delay betwen adding tracks and fetching the new playlist
    //but javascript is async so i this a a headache :(

    //I implemented a delay of 1.2 seconds, it might be better to poll the api to see if the track list has updated
    //but polling = more requests??
    //https://stackoverflow.com/questions/14249506/how-can-i-wait-in-node-js-javascript-l-need-to-pause-for-a-period-of-time (second answer)



}
module.exports = newPlaylist;