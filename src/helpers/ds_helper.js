const config = require('../config')
const creator = require('creator-js-client')(config.deviceServer.accessKey, config.deviceServer.accessSecret)
const bluebird = require('bluebird')


exports.getClients = function () {
    return creator.clients.getClients()
}

exports.subscribeToObservation = function (propertyConfig, url, callback) {
    if (propertyConfig.clientName() == null) {
        return bluebird.reject()
    }
    const promise = creator.request(
        {
            steps: ['clients', { Name: propertyConfig.clientName() }, 'objecttypes', { ObjectTypeID: propertyConfig.objectID }, 'instances', { InstanceID: propertyConfig.instanceID }, 'subscriptions'],
            method: 'POST',
            nocache: true,
            data: {
                'SubscriptionType': 'Observation',
                'Url': url,
                'Property': propertyConfig.propertyName
            }
        })
        .then((response) => {
            switch (response.statusCode) {
                case 409:
                    console.log(`Failed to subscribe to ${propertyConfig.propertyName} observation on object ${propertyConfig.objectID}/${propertyConfig.instanceID}. Already subscribed.`)
                    return bluebird.reject(null)
                case 200:
                case 201:
                case 204:
                    console.log(`Successfully subscribed to ${propertyConfig.property} on object ${propertyConfig.objectID}/${propertyConfig.instanceID} observation.`)
                    return bluebird.resolve(null)
                default:
                    console.error(`Failed to subscribe to ${propertyConfig.propertyName} observation on object ${propertyConfig.objectID}/${propertyConfig.instanceID}. Server responded with : ${response.statusCode}`)
                    return bluebird.reject(null)
            }
        },
        function (err) {
            console.error(`Failed to subscribe to ${propertyConfig.propertyName} on object ${propertyConfig.objectID}/${propertyConfig.instanceID} observation. ${err}`)
            return bluebird.reject(err)
        })
    return promise.nodeify(callback)
}

exports.subscribeToClientConnectedEvent = function (url, callback) {
    const promise = creator.request(
        {
            steps: ['subscriptions'],
            method: 'POST',
            data: {
                'SubscriptionType': 'ClientConnected',
                'Url': url
            },
            nocache: true
        })

    return promise.nodeify(callback)
}

exports.setPropertyValue = function (propertyConfig, value) {
    if (propertyConfig.clientName() == null) {
        return bluebird.reject()
    }
    return creator.request(
        {
            steps: ['clients', { Name: propertyConfig.clientName() }, 'objecttypes', { ObjectTypeID: propertyConfig.objectID }, 'instances', { InstanceID: propertyConfig.instanceID }],
            method: 'PUT',
            data: {
                [propertyConfig.propertyName]: value
            },
            nocache: true
        })
}

exports.getPropertyValue = function (propertyConfig) {
    if (propertyConfig.clientName() == null) {
        return bluebird.reject()
    }
    return creator.request(
        {
            steps: ['clients', { Name: propertyConfig.clientName() }, 'objecttypes', { ObjectTypeID: propertyConfig.objectID }, 'instances', { InstanceID: propertyConfig.instanceID }],
            method: 'GET',
            nocache: true
        })
        .then((response) => {
            if (response.statusCode == 200) {
                return response.body[propertyConfig.propertyName]
            } else {
                return null
            }
        })
}