const express = require('express');
const app = express();
const path = require('path')
const axios = require('axios');
const queryString = require('query-string');
const set_operations = require('./set_operations');
const fetch_playlists = require('./fetch_playlists');
const config = require('./config')

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))
// To parse incoming JSON in POST request body:
app.use(express.json())
const CLIENT_ID = 'aa0cd8260d834c78850ede01794ee230';
const CLIENT_SECRET = config;
const SCOPES = 'playlist-modify-public';
const REDIRECT_URI = 'http://localhost:3000/callback'
let ACCESS_TOKEN = '';
let REFRESH_TOKEN = '';

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {

    res.redirect('https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: SCOPES,
            redirect_uri: REDIRECT_URI,
        }))
})

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
        console.log(e)
    }
})

app.get('/home', async (req, res) => {
    try {
        //TODO: Show album art and prettify the list of albums
        let playlists = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
                'Authorization': 'Bearer ' + ACCESS_TOKEN
            }
        })


        playlists = playlists.data.items;

        res.render('home', { playlists })
    }
    catch (e) {
        console.log(e);
    }
})

//TODO: Modularize
//TODO: Request refresh token if necessary
//TODO: Handle playlists with over 100 songs
//TODO: Error Handling
//TODO: Result Template
app.post('/new_playlist', async (req, res) => {
    const [p1, p2] = Object.values(req.body)
    const NAME = req.body.playlist_name || 'Merged Playlist';
    const OPERATION = req.body.operation_select;

    let [playlist_1, playlist_2] = await fetch_playlists(p1, p2, ACCESS_TOKEN);
    let NEW_PLAYLIST = {}

    switch (OPERATION) {
        case "intersection":
            NEW_PLAYLIST = await set_operations.intersection(playlist_1, playlist_2, ACCESS_TOKEN, NAME)
            break;

        case "union":
            NEW_PLAYLIST = await set_operations.union(playlist_1, playlist_2, ACCESS_TOKEN, NAME)
            break;

        case "nand":
            NEW_PLAYLIST = await set_operations.nand(playlist_1, playlist_2, ACCESS_TOKEN, NAME)
            break;

        case "difference":
            NEW_PLAYLIST = await set_operations.difference(playlist_1, playlist_2, ACCESS_TOKEN, NAME)
            break


        default:
    }
    //TODO: Redirect to a results page

    res.redirect('/home');
})

app.listen(3000, () => {
    console.log('Listening on Port 3000')
})
