const dayjs = require('dayjs')
const axios = require('axios')
const endpoint = 'https://named.com/data/minigame/nball/powerball5/result.json'
const interval = 5
let game
let timerCountDown
let previousGames = []
let now = dayjs()
let hours = now.hour()
let minutes = now.minute()
let seconds = now.second()


const powerBall5 = {
    start: async() => {
        powerBall5.createGame(minutes)
        powerBall5.showGame()
        setInterval(powerBall5.main, 1000)
    },
    
    main: () => {
        now = dayjs()
        hours = now.hour()
        minutes = now.minute()
        seconds = now.second()
        if((minutes + 1) % interval === 0 && seconds === 35) {
            powerBall5.getResult()
        }
        if((minutes + 1) % interval === 0 && seconds === 40) {
            powerBall5.showResult()
            powerBall5.createGame(minutes + 1)
            powerBall5.showGame()
        }
     },

    createGame: (min) => {
        const round = powerBall5.getRound((hours * 3600) + (min * 60) + seconds) / (interval * 60)
        if(!previousGames.some(g => g.round === round)) {
            const gameDateTime = now.clone().add(5, 'minutes').second(35)
            game = {
                gameName:'namedPowerball5',
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
        // console.log("Timer countdown:" + timerCountDown + "seconds")
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
    // getResult: () => {
    //     miniGames[0].resultTime = `Time: ${tempTime}:${tempSec}`
    // },
    delay: (duration) => {
        return new Promise(resolve => setTimeout(resolve, duration))
    },
    showResult: async() => {
        // const now = moment()
        // game.result = varResult
        // game.resultDateTime = now.toISOString().replace('T', '').substring(0, 19)
        // previousGames.push(game)
        // console.log(game)
        console.log("RESULTS: ", previousGames)
        await powerBall5.delay(10000)
    },


//   scrapeData: () => {
//     tempTime++
//     try {
//       const now = moment()
//       const minutes = now.minutes()
//       const seconds = now.seconds()
//       const roundId = powerball5.generateRoundId(interval)

//       if ((minutes + 1) % interval === 0 && seconds === 35) {
//         const result = {
//           gameName: game,
//           date: now.format('YYYY-MM-DD'),
//           round: roundId,
//           gameDateTime: now.format('YYYY-MM-DDTHH:mm:ss.SSS') 
//         };

//         console.log(result)
//       }

//     } catch (err) {
//       console.error(`An error occurred - ${game}:`, err)
//     }
//   },
  

//   generateRoundId: (minute) => {
//     var now = new Date()
//     var referenceTime = new Date(now)
//     referenceTime.setHours(0,0,0,0)
//     var intervalsElapsed = Math.floor((now - referenceTime) / (minute * 60 * 1000))
//     return intervalsElapsed + 1
//   },
//   getAheadTimeBaseOnInterval: (currentMin) => {
//     let timeIncrement = currentMin
//     while (true) {
//         timeIncrement++
//         if (timeIncrement % interval === 0) {
//             return timeIncrement
//         }
//     }
// }
// }
// function generateRoundId(minute) {
//   var now = new Date()

//   var referenceTime = new Date(now)
//   referenceTime.setHours(0,0,0,0)

//   var intervalsElapsed = Math.floor((now - referenceTime) / (minute * 60 * 1000))

//   var roundId = intervalsElapsed + 1

//   return roundId
}
// setInterval(() => {
//   console.log(generateRoundId(5))
// }, 100000)

module.exports = powerBall5

powerBall5.start()


