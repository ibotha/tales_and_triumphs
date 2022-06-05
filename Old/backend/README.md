# Tales and Triumphs Backend

The backend component of the tales and triumphs project, this functions as a graphql API

## Contents

- [Tales and Triumphs Backend](#tales-and-triumphs-backend)
	- [Contents](#contents)
	- [Setup](#setup)
		- [Requirements](#requirements)
		- [Steps](#steps)
	- [Config](#config)

## Setup

Running through the following steps should leave you with a running server in no time.

### Requirements
* node, I used nvm to install the latest version.

### Steps

1. run `npm install`
2. create a file called `.env` with config variables. (See [Config](#config))
3. Generate the graphql types with `npm run generate`
4. Create the database by running `npx prisma migrate dev --name "init"`
5. Generate prisma types by running `npx prisma generate`
6. now you should be able to run the server with `npm run dev`

## Config

* USE_PLAYGROUND - If set this will use apollo playground instead of apollo studio.
* PROD - If set certain optimisations will be made for performance and security.
* SESSION_SECRET - Set to whatever session secret you would like