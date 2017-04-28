const express = require('express')
const router = express.Router()
const dsController = require('../controllers/ds_controller')
const Notifications = require('../cfg/notification_endpoints')

router.post('/*', function (req, res, next) {
    res.sendStatus(204)
    next()
})

router.post(Notifications.clientConnected, dsController.onClientConnected)
router.post(Notifications.temperatureClientName, dsController.onTemperatureClientNameChanged)
router.post(Notifications.presenceClientName, dsController.onPresenceClientNameChanged)
router.post(Notifications.heaterClientName, dsController.onHeaterClientNameChanged)
router.post(Notifications.temperature, dsController.onTemperatureChanged)
router.post(Notifications.presence, dsController.onPresenceChanged)
router.post(Notifications.heater, dsController.onHeaterStateChanged)

module.exports = router