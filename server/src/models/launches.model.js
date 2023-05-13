const axios = require('axios')

const launches = require('./launches.mongo')
const planets = require('./planets.mongo')

// const launches = new Map()

let DEFAULT_FLIGHT_NUMBER = 100

// const launch = {
//     flightNumber: 100,// flight_number
//     mission: 'kepler Exploration',//name
//     rocket: 'Explorer IS1', //rocket.name
//     launchDate: new Date('December 27, 2030'),//date_local
//     target: 'Kepler-442 b',//not applicable
//     customers: ['ZTM', 'NASA'],//payload.customers for each payload
//     upcoming: true,//upcoming
//     success: true,//success
// }

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query'

async function populateLaunchesData() {
    console.log('Downloading launch data from SpaceX')
    const response = await axios.post(SPACEX_API_URL, {
            query: {},
            options: {
                pagination: false,
                populate: [
                    {
                        path : "rocket", 
                        select: {
                            name: 1
                        }
                    }, {
                        path: "payloads",
                        select: {
                            'customers': 1
                        }
                    }
                ]
            }
        }
    )
    
    if(response.status !== 200) {
        console.log('Failed to download launch data from SpaceX')
        throw new Error('Failed to download launch data from SpaceX')
    }

    const launchDocs = response.data.docs
    for(const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads']
        const customers = payloads.flatMap((payload) => {
            return payload['customers']
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            customers,
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
        }
        console.log(`${launch.flightNumber} ${launch.mission} ${launch.rocket} `)

        await saveLaunch(launch)
    }
}

async function loadLaunchesData() {
    const firstLaunch =  await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })
    if(firstLaunch) {
        console.log('Launch Data already loaded')
    } else {
        await populateLaunchesData()
    }
    
}

async function findLaunch(filter) {
    return await launches.findOne(filter)
}

async function existLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId,
    })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches.findOne().sort('-flightNumber')

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }
    return latestLaunch.flightNumber
}

async function getAllLaunches(skip, limit) {
    return await launches.find({}, {
        '_id': 0, '__v': 0,
    }).sort({ flightNumber: 1 }).skip(skip).limit(limit)
}

async function saveLaunch(launch) {
    
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true
    })
}

async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target,
    })

    if (!planet) {
        throw new Error('Planet not found')
    }

    const newFlightNumber = await getLatestFlightNumber() + 1

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customer: ['ZTM', 'NASA'],
        flightNumber: newFlightNumber,
    })

    await saveLaunch(newLaunch)
}


async function abortLaunchById(launchId) {

    const aborted = await launches.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false
    })

    return aborted.modifiedCount === 1
}

module.exports = {
    loadLaunchesData,
    existLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById
}