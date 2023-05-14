const axios = require('axios')

const PLANETS_URL = "https://8000-devsam17-nasaproject-tcxulcqyayl.ws-us97.gitpod.io/v1/planets"

const LAUNCH_URL = "https://8000-devsam17-nasaproject-tcxulcqyayl.ws-us97.gitpod.io/v1/launches"

async function getPlanets() {
    const resp = await axios.get(PLANETS_URL)
    console.log("Status",resp.status)
    console.log("Planets ",resp.data)
}

// getPlanets()

async function getLaunches() {
    const resp = await axios.get(`${LAUNCH_URL}?limit=10&page=1`)
    console.log(resp.data)
}

// getLaunches() 

async function postLaunches() {
    const launch = {
        "mission": "super",
        "rocket": "ZTM Experimental IS1",
        "target": "Kepler-62 f",
        "launchDate": "Janunary 17, 2030"
    }

    const response = await axios.post(LAUNCH_URL, launch)
    console.log(response.data)

}

// postLaunches()

async function deleteLaunch(id) {
    const resp = await axios.delete(`${LAUNCH_URL}/${id}`)
    console.log(resp.data)
}

// deleteLaunch(204)
