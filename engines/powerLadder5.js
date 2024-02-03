const dayjs = require('dayjs')
const axios = require('axios')
const endpoint = 'https://named.com/data/minigame/nball/powerladder5/result.json'
const interval = 5
let game
let timerCountDown
let previousGames = []
let now = dayjs()
let hours = now.hour()
let minutes = now.minute()
let seconds = now.second()

const powerLadder5 = {
    start: async () => {
        powerLadder5.createGame(minutes)
        powerLadder5.showGame()
        setInterval(powerLadder5.main, 1000)
    },

    main: () => {
        now = dayjs()
        hours = now.hour()
        minutes = now.minute()
        seconds = now.second()
        if((minutes + 1) % interval === 0 && seconds === 35) {
            powerLadder5.getResult()
        }
        if((minutes + 1) % interval === 0 && seconds === 40) {
            powerLadder5.showResult()
            powerLadder5.createGame(minutes + 1)
            powerLadder5.showGame()
        }

    },

    createGame: (min) => {
        const round = powerLadder5.getRound((hours * 3600) + (min * 60) + seconds) / (interval * 60)
        if(!previousGames.some(g => g.round === round)) {
            const gameDateTime = now.clone().add(5, 'minutes').second(35)
            game = {
                gameName:'namedPowerladder5',
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

    getResult: async() => {
        try {
            const timeStamp = Date.now()
            const urlWithTimestamp = `${endpoint}?_=${timeStamp}`
            const response = await axios.get(urlWithTimestamp)
            const rData = response.data

            let LR = powerLadder5.convertSmallLetter(rData.s)
            let ball = rData.l
            let OE = powerLadder5.convertSmallLetter(rData.o)
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
        await powerLadder5.delay(10000)
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

module.exports = powerLadder5

powerLadder5.start()