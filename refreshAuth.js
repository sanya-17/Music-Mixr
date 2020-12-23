//gets refresh token
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

module.exports = refreshAuth;