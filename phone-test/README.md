# Aircall

### Points addressed on the challenge
- fix the logout feature
- fix the token expiration UX
- add e2e tests
- implement the archive call feature and add real-time support [here](https://github.com/filipe7rito/frontend-hiring-test/pull/1)
- improve the pagination in the calls list view

## Requirements

For development, you will only need Node.js installed on your environement.

#### Node

[Node](http://nodejs.org/) is really easy to install & now include [NPM](https://npmjs.org/).
You should be able to run the following command after the installation procedure
below.

Suggested versions:

    $ node --version
    v14.x.x

    $ npm --version
    7.x.x

### Initial setup

In order to install project dependencies you need to execute the following command:

### `yarn`

<br>

## Available Scripts

In the project directory, you can run the following scrips:

### `yarn dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload trying to preserve the state due to react-refresh and Hot module reload.<br>

### `yarn test`

Runs application tests .<br>

### `yarn test:e2e:run`

Runs E2E tests.<br>

### `yarn test:e2e:open`

Runs E2E tests in interactive mode.<br>

### `yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified<br>
Your app is ready to be deployed into production!

## Tech used

This challenge was developed with help of the following technologies:

- [Cypress](https://www.cypress.io/) for e2e tests
- [subscriptions-transport-ws](https://github.com/apollographql/subscriptions-transport-ws) for subscription support
