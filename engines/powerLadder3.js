const dayjs = require('dayjs')
const axios = require('axios')
const endpoint = 'https://named.com/data/minigame/nball/powerladder3/result.json'
const interval = 3
let game
let timerCountDown
let previousGames = []
let now = dayjs()
let hours = now.hour()
let minutes = now.minute()
let seconds = now.second()

const powerLadder3 = {
    start: async() => {
        powerLadder3.createGame(minutes)
        powerLadder3.showGame()
        setInterval(powerLadder3.main, 1000)
    },

    main: () => {
        now = dayjs()
        hours = now.hour()
        minutes = now.minute()
        seconds = now.second()
        if((minutes + 1) % interval === 0 && seconds === 35) {
            powerLadder3.getResult()
        }
        if((minutes + 1) % interval === 0 && seconds === 40) {
            powerLadder3.showResult()
            powerLadder3.createGame(minutes + 1)
            powerLadder3.showGame()
        }
    },

    createGame: (min) => {
        const round = powerLadder3.getRound((hours * 3600) + (min * 60) + seconds) / (interval * 60)
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

            let LR = powerLadder3.convertSmallLetter(rData.s)
            let ball = rData.l
            let OE = powerLadder3.convertSmallLetter(rData.o)
            const results = [LR, ball, OE]

            
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
        await powerLadder3.delay(10000)
    },
    convertSmallLetter: (term) => {
        const BigToSmall = {
            'ODD': 'odd',
            'EVEN': 'even',
            'LEFT': 'left',
            'RIGHT': 'right',
        }
        return BigToSmall[term] || term
    }

}
module.exports = powerLadder3

powerLadder3.start()