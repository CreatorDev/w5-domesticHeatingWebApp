module.exports = {
    deviceServer: {
        url: "https://deviceserver.cretordev.io",
        accessKey: '<access_key>',
        accessSecret: '<access_secret>'
    },
    // influx db configuration
    database: {
        uri: "influxdb:5488",
        name: "climate_db"
    },
    masterControllerClientName: "MasterControllerClientName",
    // your host on which app is running, necessary to set subscription uri
    host: "https://ngrok_URL",
}