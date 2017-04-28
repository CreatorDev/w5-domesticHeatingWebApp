![logo](https://static.creatordev.io/logo-md-s.svg)

# Project 5 Web Application

[grafana_data_source]: ./docs/grafana_data_source.png "Grafana Data Source Configuration"

## Running
1. Install [Docker](https://www.docker.com), ngrok.
2. Run `ngrok http 5487` to create tunnel for notifications to localhost. 5487 is port of webapp already configured in Docker.
3. `cp ./config.sample.js ./src/config.js`. Configure your credentials and host for notifications. Take `accessKey` and `accessSecret` from [CreatorDev Console (API Keys)](https://console.creatordev.io). `host` is displayed after starting `ngrok` in previous step.
4. Start webapp: `docker-compose build && docker-compose up`.
5. Configure Grafana:
   - Login to Grafana: `http://localhost:5489/`. User: admin, password: admin. 
   - Configure Data Source. Password for influxDB is `root`. ![alt text][grafana_data_source]. 
   - Import dashboard from `./grafana/climate_dashboard.json`.
6. For testing purposes you could start local AwaLWM2M client, which will connect to Device Server. See instructions in [prj5HeatingControl_awa_client.sh](https://gist.github.com/rafcio2k/c6f8b10298a53b51c9e8ddf847ea1a61#file-prj5heatingcontrol_awa_client-sh).

## Configuration endpoints:
- `/temperature/name`, `/presence/name`, `/heater/name`
   - PUT Content-Type: application/json
   - GET Accept: application/json
   - HTTP Body: 
     ```
     {"name": "NEW_NAME"}
     ```
- `/temperature/delta`
   - PUT Content-Type: application/json
   - GET Accept: application/json
   - HTTP Body: 
     ```
     {"delta": "DELTA_FLOAT_VALUE"}
     ```
- `/schedule`
   - PUT Content-Type: application/json
   - GET Accept: application/json
   - HTTP Body: 
     ```
     {"schedule": "SCHEDULE"}
     ```

## Testing with curl
You could test configuration endpoints with following curl commands:
```sh
curl -i -X PUT -H "Content-Type: application/json" -d '{"name":"NewTemperatureName"}' http://127.0.0.1:5487/temperature/name
curl -i http://127.0.0.1:5487/temperature/name

curl -i -X PUT -H "Content-Type: application/json" -d '{"name":"NewPresenceName"}' http://127.0.0.1:5487/presence/name
curl -i http://127.0.0.1:5487/presence/name

curl -i -X PUT -H "Content-Type: application/json" -d '{"name":"NewHeaterName"}' http://127.0.0.1:5487/heater/name
curl -i http://127.0.0.1:5487/heater/name

curl -i -X PUT -H "Content-Type: application/json" -d '{"delta":"23.86"}' http://127.0.0.1:5487/temperature/delta
curl -i http://127.0.0.1:5487/temperature/delta

curl -i -X PUT -H "Content-Type: application/json" -d '{"schedule":"some schedule"}' http://127.0.0.1:5487/schedule
curl -i http://127.0.0.1:5487/schedule
```