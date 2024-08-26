# CrunchHTTPClients

Desktop &amp; Web clients for Crunch HTTP using Bun.js

## Build Instructions

#### 1. Build for Desktop (Linux, Windows or Mac)

```shell
# To build for linux
bun run build:linux

# To build for windows
bun run build:windows

# To build for mac
bun run build:mac
```

The commands to build these packages have been taken from Bun docs available at: [https://bun.sh/docs/bundler/executables](https://bun.sh/docs/bundler/executables)

Incase you want to build for ARM Architecture, feel free to modify commands from `package.json` specified in scripts section as per the docs.

#### 2. Build for AWS Lambda

```shell
# To build for aws
bun run build:aws
```

#### 3. Run application on Desktop (Linux, Windows or Mac)

Requirements:

- Application needs a crunch.http.config.json file in current directory. It will create automatically on first run and you must update it with dashboard data.

```shell
# To mark file as executable in linux or mac
chmod +x ./bins/linux.sh

# To run on linux
./bins/linux.sh

# To run on windows
# You can double click windows.exe file in bins/ directory
```

#### 4. Run application on AWS Lambda

Requirements:

- Setup environment variables `CRUNCH_HTTP_DEVICE_ID` and `CRUNCH_HTTP_ENDPOINT` from aws lambda dashboard.
- Build the application for aws lambda using above instructions and
- Create new aws lambda function from dashboard and replace contents of lambda function with contents from `bins/aws.js`

Now you can fire your function in async mode and it will keep running for 19 minutes and then automatically exit once done.
