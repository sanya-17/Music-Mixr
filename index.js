const express = require('express');
const app = express();
const path = require('path')
const axios = require('axios');
const queryString = require('query-string');

//To parse form data in POST request body:
app.use(express.urlencoded({ extended: true }))
// To parse incoming JSON in POST request body:
app.use(express.json())
const CLIENT_ID = 'aa0cd8260d834c78850ede01794ee230';
const CLIENT_SECRET = 'fd33edad833d4654885a9bfa925be64a'
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
        console.log(result.data);
        ACCESS_TOKEN = result.data.access_token;
        REFRESH_TOKEN = result.data.refresh_token;
        console.log(ACCESS_TOKEN);
        console.log(REFRESH_TOKEN);
        res.redirect('/home')
    }
    catch (e) {
        console.log(e)
    }
})

app.get('/home', (req, res) => {
    try {
        res.render('home')
    }
    catch (e) {
        console.log(e);
    }
})

app.listen(3000, () => {
    console.log('Listening on Port 3000')
})

/*
const loginBtn = document.querySelector('#login');
loginBtn.addEventListener('click', getToken)
*/