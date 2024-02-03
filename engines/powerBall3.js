const dayjs = require('dayjs')
const axios = require('axios')
const endpoint = 'https://named.com/data/minigame/nball/powerball3/result.json'
const interval = 3
let game
let timerCountDown
let previousGames = []
let now = dayjs()
let hours = now.hour()
let minutes = now.minute()
let seconds = now.second()

const powerBall3 = {
    start: async() => {
        powerBall3.createGame(minutes)
        powerBall3.showGame()
        setInterval(powerBall3.main, 1000)
    },

    main: () => {
        now = dayjs()
        hours = now.hour()
        minutes = now.minute()
        seconds = now.second()
        if((minutes + 1) % interval === 0 && seconds === 35) {
            powerBall3.getResult()
        }
        if((minutes + 1) % interval === 0 && seconds === 40) {
            powerBall3.showResult()
            powerBall3.createGame(minutes + 1)
            powerBall3.showGame()
        }
    },

    createGame: (min) => {
        const round = powerBall3.getRound((hours * 3600) + (min * 60) + seconds) / (interval * 60)
        if(!previousGames.some(g => g.round === round)) {
            const gameDateTime = now.clone().add(3, 'minutes').second(35)
            game = {
                gameName: 'namedPowerball3',
                round: round,
                result: null,
                gameDate: now.format('YYYY-MM-DD'),
                regDateTime: now.format('YYYY-MM-DD HH:mm:ss'), 
                gameDateTime: gameDateTime.format('YYYY-MM-DD HH:mm:ss'),
                resultDateTime: null
            }

        }
    },

    showGame: () => {
        timerCountDown = interval * 60
        console.log("NEW GAME: ", game)
    },

    getResult: async () => {
        try {
            const timeStamp = Date.now()
            const urlWithTimestamp = `${endpoint}?_=${timeStamp}`
            const response = await axios.get(urlWithTimestamp)
            const rData = response.data

            let firstNum = parseInt(rData.ball[0])
            let secondNum = parseInt(rData.ball[1])
            let thirdNum = parseInt(rData.ball[2])
            let fourthNum = parseInt(rData.ball[3])
            let fifthNum = parseInt(rData.ball[4])
            let sixthNum = parseInt(rData.ball[5])
            const results = [firstNum, secondNum, thirdNum, fourthNum, fifthNum, sixthNum]

            
            let gameDateTimeDayjs = dayjs(game.gameDateTime, 'YYYY-MM-DD HH:mm:ss')
            let resultDateTime = gameDateTimeDayjs.add(15, 'seconds').format('YYYY-MM-DD HH:mm:ss')

            game = { 
                ...game,
                result: results,
                resultDateTime: resultDateTime
            }

            previousGames.push({...game})
        } catch (error) {
            console.error('Error fetching game results:', error)
        }
    },

    getRound: (v) => {
        var sec = v
        while (sec % (interval * 60) != 0){
            sec++
        }
        return sec
    },

    delay: (duration) => {
        return new Promise(resolve => setTimeout(resolve, duration))
    },
    showResult: async() => {
        console.log("RESULTS: ", previousGames)
        await powerBall3.delay(10000)
    },

}
module.exports = powerBall3

powerBall3.start()