# Argos Frontend [![Build Status](https://cloud.drone.io/api/badges/argosnotary/argos-frontend/status.svg)](https://cloud.drone.io/argosnotary/argos-frontend) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=argosnotary_argos-frontend&metric=alert_status)](https://sonarcloud.io/dashboard?id=argosnotary_argos-frontend)

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs all packages.

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm test -- "-u"`

To update the `Jest` snapshots.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Create api source code

The npm openapi generator doesn't work correctly.

So download and install at https://openapi-generator.tech/docs/installation/

Set the version to 5.0.0-beta3

`openapi-generator-cli version-manager set 5.0.0-beta3`

Generate api based on tag 1.0.3

`openapi-generator-cli generate -i https://raw.githubusercontent.com/argosnotary/argos-parent/1.0.3/argos-service-api/api.yml -g typescript-axios -o src/api --additional-properties=enumPropertyNaming=original`

### persistent backend

```shell
   docker volume create data_db
   docker volume create data_configdb
```

start backend

```shell
   docker-compose up
```

## Sign Drone pipeline

```sh
export DRONE_SERVER=https://drone.argosnotary.com
export DRONE_TOKEN=<drone token>

drone sign --save argosnotary/argos-frontend ./drone.yml
```
