const axios = require('axios');


//get list of track URIs in a playlist given playlist id and access token

const getTracks = async (playlist_id, ACCESS_TOKEN) => {
    URIs = [];
    //fetch playlist tracks
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
    //dummy finally block. Exceptions will be caught in index.js
    finally {
    }
}

module.exports = getTracks;