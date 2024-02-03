
const enginepowerBall5 = require('.engines/powerBall5')
const enginepowerBall3 = require('.engines/powerBall3')
const enginepowerLadder5 = require('.engines/powerLadder5')
const enginepowerLadder3 = require('.engines/powerLadder3')
;(async () => {
    enginepowerLadder5.start()
    enginepowerLadder3.start()
    enginepowerBall5.start()
    enginepowerBall3.start()
})()