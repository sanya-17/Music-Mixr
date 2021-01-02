const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path')
const axios = require('axios');
const queryString = require('query-string');
const setOperations = require('./setOperations');
const getTracks = require('./getTracks');
const config = process.env.PORT ? '' : require('./config');
const newPlaylist = require('./newPlaylist')
const session = require('cookie-session');
const flash = require('connect-flash');

const sessionOptions = { secret: 'klnaljk23012lkjdaya2', resave: false, saveUninitialized: false }
app.use(session(sessionOptions));
app.use(flash());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
const CLIENT_ID = 'aa0cd8260d834c78850ede01794ee230';
const CLIENT_SECRET = process.env.PORT ? process.env.CLIENT_SECRET : config;
const SCOPES = 'playlist-modify-public';
const REDIRECT_URI = process.env.PORT ? 'https://music-mixr.herokuapp.com/callback' : 'http://localhost:3000/callback'
let ACCESS_TOKEN = '';
let REFRESH_TOKEN = '';
let NEW_PLAYLIST = {};



app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


const refreshAuth = async () => {
    let data = {
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    }
    try {
        const result = await axios.post('https://accounts.spotify.com/api/token', queryString.stringify(data))
        ACCESS_TOKEN = result.data.access_token;
    }
    catch (e) {
        console.log(e.response)
    }
}

app.get('/', (req, res) => {
    res.render('index')
})

//redirects to callback route with the required params
app.get('/login', (req, res) => {

    res.redirect('https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: SCOPES,
            redirect_uri: REDIRECT_URI,
        }))
})

//retrieves access and refresh token
app.get('/callback', async (req, res) => {
    let code = req.query.code;

    let data = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    }

    try {
        const result = await axios.post('https://accounts.spotify.com/api/token', queryString.stringify(data))
        ACCESS_TOKEN = result.data.access_token;
        REFRESH_TOKEN = result.data.refresh_token;
        res.redirect('/home')
    }
    catch (e) {
        console.log(e.response)
    }
})

//handles playlist entry
app.get('/home', async (req, res) => {
    try {
        let playlists = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
        })
        playlists = playlists.data.items;

        res.render('home', { playlists, messages: req.flash('danger') })
    }
    catch (e) {
        if (e.response.status === 401) {
            refreshAuth();
            return res.redirect('/home')
        }

        return res.redirect('/');
    }
})

//finds the result of the operation and creates a new playlist
app.post('/new_playlist', async (req, res) => {
    const p1 = req.body.playlist_1, p2 = req.body.playlist_2;
    const NAME = req.body.playlist_name || 'Merged Playlist';
    const OPERATION = req.body.operation_select;

    //getTracks
    try {
        var playlist_1 = await getTracks(p1, ACCESS_TOKEN);
        var playlist_2 = await getTracks(p2, ACCESS_TOKEN);
    }
    catch (e) {
        if (e.response.status === 401) {
            refreshAuth();
            return res.redirect('/home')
        }
        return res.redirect('/')
    }

    let NEW_PLAYLIST_URIs = [];
    //perform operation on track URI's and create a new playlist
    try {
        switch (OPERATION) {
            case "intersection":
                NEW_PLAYLIST_URIs = await setOperations.intersection(playlist_1, playlist_2, ACCESS_TOKEN, NAME)
                if (!NEW_PLAYLIST_URIs.length) {
                    req.flash('danger', 'The operation must result in a non-empty playlist');
                    return res.redirect('/home')
                }
                NEW_PLAYLIST = await newPlaylist(NEW_PLAYLIST_URIs, ACCESS_TOKEN, NAME);
                console.log(NEW_PLAYLIST);
                res.redirect('/result')
                break;

            case "union":
                NEW_PLAYLIST_URIs = await setOperations.union(playlist_1, playlist_2, ACCESS_TOKEN, NAME)
                if (!NEW_PLAYLIST_URIs.length) {
                    req.flash('danger', 'The operation must result in a non-empty playlist');
                    return res.redirect('/home')
                }
                NEW_PLAYLIST = await newPlaylist(NEW_PLAYLIST_URIs, ACCESS_TOKEN, NAME);
                console.log(NEW_PLAYLIST);
                res.redirect('/result')
                break;

            case "nand":
                NEW_PLAYLIST_URIs = await setOperations.nand(playlist_1, playlist_2, ACCESS_TOKEN, NAME)
                if (!NEW_PLAYLIST_URIs.length) {
                    req.flash('danger', 'The operation must result in a non-empty playlist');
                    return res.redirect('/home')
                }
                NEW_PLAYLIST = await newPlaylist(NEW_PLAYLIST_URIs, ACCESS_TOKEN, NAME);
                console.log(NEW_PLAYLIST);
                res.redirect('/result')
                break;

            case "difference":
                NEW_PLAYLIST_URIs = await setOperations.difference(playlist_1, playlist_2, ACCESS_TOKEN, NAME)
                if (!NEW_PLAYLIST_URIs.length) {
                    req.flash('danger', 'The operation must result in a non-empty playlist');
                    return res.redirect('/home')
                }
                NEW_PLAYLIST = await newPlaylist(NEW_PLAYLIST_URIs, ACCESS_TOKEN, NAME);
                console.log(NEW_PLAYLIST);
                res.redirect('/result')
                break;
            default:
        }
    }
    catch (e) {
        if (e.response.status === 401) {
            refreshAuth();
            return res.redirect('/home')
        }
        return res.redirect('/')
    }
})

app.get('/result', (req, res) => {
    //if the new playlist is empty, return home
    if (!NEW_PLAYLIST.name)
        return res.redirect('/home')
    res.render('result', { NEW_PLAYLIST });
})

app.use(function (req, res, next) {
    res.status(404).render('_404')
})


app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
})
