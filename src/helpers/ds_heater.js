const config = require('../config')
const dsHelper = require('./ds_helper')
const DSResources = require('../cfg/ds_resources')
const Notifications = require('../cfg/notification_endpoints')

exports.subscribeToClientConnectedChanges = function () {
    dsHelper.subscribeToClientConnectedEvent(config.host + Notifications.endpointPrefix + Notifications.clientConnected)
        .then((response) => {
            console.log("Successfully subscribed to client connected event")
        })
        .catch((err) => {
            console.error(err)
        })
}

exports.subscribeToTemperatureClientNameChanges = function () {
    dsHelper.subscribeToObservation(DSResources.temperatureClientName, config.host + Notifications.endpointPrefix + Notifications.temperatureClientName)
        .then((response) => {
            console.log("Succesfully subscribed to IPSO Temperature Client Name changes.")
        })
        .catch((err) => {
            console.log(err)
        })
}

exports.subscribeToPresenceClientNameChanges = function () {
    dsHelper.subscribeToObservation(DSResources.presenceClientName, config.host + Notifications.endpointPrefix + Notifications.presenceClientName)
        .then((response) => {
            console.log("Succesfully subscribed to IPSO Presence Client Name changes.")
        })
        .catch((err) => {
            console.log(err)
        })
}

exports.subscribeToHeaterClientNameChanges = function () {
    dsHelper.subscribeToObservation(DSResources.heaterClientName, config.host + Notifications.endpointPrefix + Notifications.heaterClientName)
        .then((response) => {
            console.log("Succesfully subscribed to IPSO Heater Client Name changes.")
        })
        .catch((err) => {
            console.log(err)
        })
}

exports.subscribeToTemperatureChanges = function () {
    dsHelper.subscribeToObservation(DSResources.temperature, config.host + Notifications.endpointPrefix + Notifications.temperature)
        .then((response) => {
            console.log("Succesfully subscribed to IPSO Temperature value object changes.")
        })
        .catch((err) => {
            console.log(err)
        })
}

exports.subscribeToPresenceStateChanges = function () {
    dsHelper.subscribeToObservation(DSResources.presence, config.host + Notifications.endpointPrefix + Notifications.presence)
        .then((response) => {
            console.log("Succesfully subscribed to IPSO Presence Sensor value changes.")
        })
        .catch((err) => {
            console.log(err)
        })
}

exports.subscribeToHeaterStateChanges = function () {
    dsHelper.subscribeToObservation(DSResources.heater, config.host + Notifications.endpointPrefix + Notifications.heater)
        .then((response) => {
            console.log("Succesfully subscribed to IPSO Heater state changes.")
        })
        .catch((err) => {
            console.log(err)
        })
}

function updateTemperatureClientName() {
    return dsHelper.getPropertyValue(DSResources.temperatureClientName)
        .then((name) => {
            DSResources.setTemperatureClientName(name)
        })
}

function updatePresenceClientName() {
    return dsHelper.getPropertyValue(DSResources.presenceClientName)
        .then((name) => {
            DSResources.setPresenceClientName(name)
        })
}

function updateHeaterClientName() {
    return dsHelper.getPropertyValue(DSResources.heaterClientName)
        .then((name) => {
            DSResources.setHeaterClientName(name)
        })
}


exports.updateClientsNamesAndSubscribeForChanges = function () {
    this.subscribeToTemperatureClientNameChanges()
    this.subscribeToPresenceClientNameChanges()
    this.subscribeToHeaterClientNameChanges()

    updateTemperatureClientName()
        .then(() => {
            this.subscribeToTemperatureChanges()
        })
    updatePresenceClientName()
        .then(() => {
            this.subscribeToPresenceStateChanges()
        })
    updateHeaterClientName()
        .then(() => {
            this.subscribeToHeaterStateChanges()
        })
}