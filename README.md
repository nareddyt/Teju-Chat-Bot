# Teju's Facebook Messenger ChatBot

[![standard-readme compliant](https://img.shields.io/badge/standard--readme-OK-green.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/nareddyt/Teju-Chat-Bot/tree/master)

> A personal assistant bot for Facebook Messenger.

Teju's first personal assistant chatbot for Facebook Messenger. Currently supports:
- Basic conversation with a default Dialogueflow agent
- The ability to remember flight details and notify the user for check-in

Software Architecture:
- Frontend: Facebook Messenger
- NLP: Dialogueflow
- Fulfillment: The node.js code in this repository

## Table of Contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Maintainers](#maintainers)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

- Node.js and npm
- A postrgres database
- Dialogueflow account
- Facebook Developer account

### Setup Postrgres

Setup the `users` table with the schema found in `db/postgre_sql/requestTimes.js`.

Export the connection string.

### Setup Dialogueflow Agent

The root directly of this repository contains an export of the Dialogueflow agent: `agent.zip`.
This must be directly imported into your Dialogueflow account to setup the agent with the correct intents.
Manually change the fulfillment credentials.

Export the API token in order to send queries to the agent.

### Setup Facebook Page

In the Facebook Developer portal, create a new Facebook page for the bot.
Manually set the verification token.

Export the app secret and page access token.

## Install

Install the local dependencies listed in `package.json` with:

```bash
npm install
```

## Usage

### Setup Environment Variables

Setup all environment variables as described in `app.json`.

### Run

The agent can be run with the following command:

```
npm start
```

### Deploy

This agent can be directly deployed to Heroku, no modifications required.

## API

The API definitions can be found in the `server` directory.

## Maintainers

[@nareddyt](https://github.com/nareddyt)

## Contributing

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

GLP-3.0 © 2019 Tejasvi Nareddy
