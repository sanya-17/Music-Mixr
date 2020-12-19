const axios = require('axios');


//get list of URIs

const getTracks = async function (playlist_id, ACCESS_TOKEN) {
    URIs = [];
    try {
        var playlist = await axios.get(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            },
            params: {
                'fields': 'items(track(uri)),next,total'
            }
        })
        playlist = playlist.data;

        for (let item of playlist.items) {
            if (item.track)
                URIs.push(item.track.uri);
        }

        while (playlist.next) {
            playlist = await axios.get(playlist.next, {
                headers: {
                    'Authorization': 'Bearer ' + ACCESS_TOKEN
                },
                params: {
                    'fields': 'items(track(uri)),next,total'
                }
            })

            playlist = playlist.data;

            for (let item of playlist.items) {
                if (item.track)
                    URIs.push(item.track.uri);
            }
        }

        return URIs;
    }
    catch (e) {
        //do something
    }
}

module.exports = getTracks;