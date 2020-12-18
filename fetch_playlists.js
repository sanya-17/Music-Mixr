const axios = require('axios');

const fetch_playlists = async function (p1, p2, ACCESS_TOKEN) {
    //call API to fetch playlist 1
    try {
        var playlist_1 = await axios.get(`https://api.spotify.com/v1/playlists/${p1}`, {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            },
            params: {
                'fields': 'name,tracks.items(track)'
            }
        });
    }
    catch (e) {
        console.log(e);
        // res.redirect('/');
    }

    //call API to fetch playlist 2
    try {
        var playlist_2 = await axios.get(`https://api.spotify.com/v1/playlists/${p2}`, {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            },
            params: {
                'fields': 'name, tracks.items.track(uri,name)'
            }
        });
    }
    catch (e) {
        console.log(e);
        //res.redirect('/');
    }


    playlist_1 = playlist_1.data;
    playlist_2 = playlist_2.data;
    console.log('inside of fetch')
    console.log(playlist_1);
    console.log(playlist_2);

    return [playlist_1, playlist_2];
}

module.exports = fetch_playlists;