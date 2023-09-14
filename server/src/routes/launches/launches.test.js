const request = require('supertest')

require('dotenv').config({ path: './.env'})

const app = require('../../app')
const { mongoConnect, mongoDisconnect } = require('../../services/mongo')

const { loadPlanetsData }  = require('../../models/planets.models')

describe('Launches Api', () => {
    beforeAll(async () => {
        await mongoConnect()
    })

    afterAll(async () => {
        await mongoDisconnect();
        await loadPlanetsData();
    })

    describe('Test GET /launches', () => {
        test('it should respond with 200 success', async () => {
            const response = await request(app).get('/v1/launches').expect('Content-Type', /json/).expect(200)
        })
    })
    
    
    describe('Test POST /launches', () => {
        const completeLaunchData = {
            mission: "USS Enterprises",
            rocket: "NCC 1701",
            target: "Kepler-62 f",
            launchDate: "January 4, 2028",
        }
    
        const launchDataWithoutDate = {
            mission: "USS Enterprises",
            rocket: "NCC 1701",
            target: "Kepler-62 f",
    
        }
        const launchDataWithInvalidDate = {
            mission: "USS Enterprises",
            rocket: "NCC 1701",
            target: "Kepler-62 f",
            launchDate: "Not a date"
        }
    
        test('it should respond with 201 success', async () => {
    
            const response = await request(app).post('/v1/launches').send(completeLaunchData).expect('Content-Type', /json/).expect(201)
    
            const requestDate = new Date(completeLaunchData.launchDate).valueOf()
            const responseDate = new Date(response.body.launchDate).valueOf()
            expect(responseDate).toBe(requestDate)
    
            expect(response.body).toMatchObject(launchDataWithoutDate)
        })
    
        test('it should catch missing required properties', async () => {
            const response = await request(app).post('/v1/launches').send(launchDataWithoutDate).expect('Content-Type', /json/).expect(400)
    
            expect(response.body).toStrictEqual({
                error: 'Missing required launch property',
            })
        })
        // test('it should catch invalid date property', async () => {
        //     const response = await request(app).post('/v1/launches').send(launchDataWithInvalidDate).expect('Content-Type', /json/).expect(400)
    
        //     expect(response.body).toStrictEqual({
        //         error: 'Invalid launch date'
        //     })
        // })
    
    })
})

