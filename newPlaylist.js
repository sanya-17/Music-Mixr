const axios = require('axios');

const newPlaylist = async function (URIs, ACCESS_TOKEN, NAME) {
    let current = URIs.slice(0, 100);
    let rest = URIs.slice(100);

    //add songs from current
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
    catch (e) {
        console.log(e);
        return;
    }

    console.log("new playlist")
    //console.log(NEW_PLAYLIST.data);
    const NEW_PLAYLIST_ID = NEW_PLAYLIST.data.id;

    const URL = NEW_PLAYLIST.data.external_urls.spotify;
    // console.log(NEW_PLAYLIST_ID);
    console.log(URL);

    //TODO: Destructure Object to get external URL and other necessary fields


    //add tracks to new playlist

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

        const result = axios.post(`https://api.spotify.com/v1/playlists/${NEW_PLAYLIST_ID}/tracks`, data, config)
    }
    catch (e) {
        console.log(e);
        //do sumn else
        //res.redirect('/');
    }

    while (rest.length) {
        //set current to the the next 100 in rest
        current = rest.slice(0, 100);
        //set rest to what is after  after current
        rest = rest.slice(100);
        //add songs from current
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

            const result = axios.post(`https://api.spotify.com/v1/playlists/${NEW_PLAYLIST_ID}/tracks`, data, config)

        }
        catch (e) {
            console.log(e);
            return;
            //res.redirect('/');
        }
        return NEW_PLAYLIST.data;
    }
}

module.exports = newPlaylist;