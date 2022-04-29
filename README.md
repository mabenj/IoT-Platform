# IoT Platform<!-- omit in toc -->

A simple and lightweight IoT platform made as part of _Communication Technologies and Security in IoT_ course.

The backend APIs are written in TypeScript using [Node.js](https://nodejs.org/en/docs/) and [Express.js](https://expressjs.com/en/4x/api.html). Database access is handled with [Mongoose](https://mongoosejs.com/docs/guide.html). And [node-coap](https://github.com/mcollina/node-coap) library, alongside with Express, is used to handle the CoAP traffic coming from end-devices.

The UI is a browser based [Create-React-App](https://create-react-app.dev/docs/documentation-intro) application written also in TypeScript. The UI components used are mainly provided by [React-Bootstrap](https://react-bootstrap.github.io/getting-started/introduction/).

### Live Demo<!-- omit in toc -->

https://simple-iot-platform.herokuapp.com/

# Table of Contents<!-- omit in toc -->

-   [Installation](#installation)
    -   [Prerequisites](#prerequisites)
    -   [Running locally](#running-locally)
    -   [Development](#development)
-   [Usage](#usage)
    -   [Registering a device](#registering-a-device)
    -   [Managing devices](#managing-devices)
    -   [Accessing device data](#accessing-device-data)
    -   [Sending device data](#sending-device-data)
    -   [Programmatic usage](#programmatic-usage)
    -   [Simulating Sending of Data from End-Node](#simulating-sending-of-data-from-end-node)
-   [Web API endpoints](#web-api-endpoints)
    -   [/api/devices](#apidevices)
    -   [/api/deviceData](#apidevicedata)
-   [HTTP API endpoints](#http-api-endpoints)
    -   [/{accessToken}](#accesstoken)
-   [CoAP API endpoints](#coap-api-endpoints)
    -   [/{accessToken}](#accesstoken-1)

## Installation

### Prerequisites

-   Node (and npm)
    -   https://nodejs.org/en/download/
-   TypeScript
    -   install with `npm install -g typescript`
-   MongoDB database

    -   Connection to MongoDB requires a `.env` file in the root directory with the following entries in it:

        `MONGO_USERNAME=<username>`

        `MONGO_PASSWORD=<password>`

        `MONGO_HOST=<host (e.g. cluster1337.foobar.mongodb.net/iot-platform)>`

### Running locally

1. `git clone`
2. `cd IoT-Platform`
3. `npm install`
4. `npm run build`
5. `npm start`
6. View the UI in the browser http://localhost:7000
7. Consume the REST API at http://localhost:7000/api

### Development

1. `git clone`
2. `cd IoT-Platform`
3. **Back-end**

    3.1 `npm install`

    3.2 `npm run dev:api`

4. **Front-end**

    4.1 `cd src/client-app`

    4.2 `npm install`

    4.3 `npm run dev:client`

    4.4 View the UI in browser http://localhost:3000

## Usage

### Registering a device

![Registering devices](https://i.imgur.com/29icufS.png)

New devices can be registered in the **Register a Device** page. When registering a device, you must specify a name, optional description, status (enabled or disabled), communication protocol, and an access token. The access token is used to send data from the end-devices to the IoT platform.

### Managing devices

![Registered devices](https://i.imgur.com/BzdfHSh.png)
![Device configuration](https://i.imgur.com/Rzy1sfM.png)

Registered devices can be viewed in the **View Devices** page. From there you can delete a device by pressing the corresponding red **delete** button. To view or update a device's configuration, you must select a device from the list. This will navigate you to the device's configration page where you can view and update the configuration.

### Accessing device data

![Device data](https://i.imgur.com/S1A03DK.png)

To view the received device data, you must press the **View Device Data** button while not modifying the device in the device's configuration page. In the device data page you can view the most recent received data, export all of the device data (JSON), or delete all of the device data.

### Sending device data

To send device data to the platform, you must perform an appropriate request to an API endpoint with a valid access token. Reference [HTTP API endpoints](#http-api-endpoints) or [CoAP API endpoints](#coap-api-endpoints) to make the requests. If the device that the access token belongs to is disabled or if it does not exist, the token is not valid.

### Programmatic usage

To fetch device data and to create and modify devices via a REST interface, reference [Web API endpoints](#web-api-endpoints) on how to do it.

### Simulating Sending of Data from End-Node

To simulate an end-device sending data to the platform, the project contains a npm script that can mock HTTP or CoAP requests. To use the script run `npm run demo-device <protocol> <address> <access_token> <data_type> <count> <interval>` where:

-   `protocol` is http or coap
-   `address` is the API address (e.g. localhost:7100)
-   `access_token` is the access token of a valid registered device
-   `data_type` is the type of the demo data set, options are car, water, weather, word
-   `count` is the number of requests to be made
-   `interval` is the request interval in milli seconds

Example: `npm run demo-device http localhost:7100 superSecret123 word 5 0`

## Web API endpoints

Web API port can be configured with `WEB_PORT` in the `.env` file. (Default 7000)

### /api/devices

-   `GET /api/devices` Gets all the registered devices

    ```
    Response Body:
    [
      {
          id: <string>
          name: <string>,
          accessToken: <string>,
          enabled: <boolean>,
          protocol: "http" | "coap",
          description: <string>,
          createdAt: Date,
          updatedAt: Date,
      },
      ...
    ]
    ```

-   `GET /api/devices/{id}` Gets a registered device that has the corresponding id

    ```
    Response Body:
    {
       id: <string>
       name: <string>,
       accessToken: <string>,
       enabled: <boolean>,
       protocol: "http" | "coap",
       description: <string>,
       createdAt: Date,
       updatedAt: Date,
    }
    ```

-   `POST /api/devices` Registers a new device

    ```
     Request Body:
     {
         name: <string>,
         accessToken: <string>,
         enabled: <boolean>,
         protocol: "http" | "coap"
      }
    ```

    ```
    Response Body:
    {
       id: <string>
       name: <string>,
       accessToken: <string>,
       enabled: <boolean>,
       protocol: "http" | "coap",
       description: <string>,
       createdAt: Date,
       updatedAt: Date,
    }
    ```

-   `PUT /api/devices/{id}` Modifies a registered device that has the corresponding id with the details provided in the body

    ```
     Request Body:
     {
         name?: <string>,
         accessToken?: <string>,
         enabled?: <boolean>,
         protocol?: "http" | "coap"
     }
    ```

    ```
    Response Body:
    {
       id: <string>
       name: <string>,
       accessToken: <string>,
       enabled: <boolean>,
       protocol: "http" | "coap",
       description: <string>,
       createdAt: Date,
       updatedAt: Date,
    }
    ```

-   `DELETE /api/device/{id}` Deletes a registered device that has the corresponding id

### /api/deviceData

-   `GET /api/deviceData/{id}?start={startIndex}&stop={stopIndex}` Gets the device data associated with a device that has the corresponding id starting from start index to stop index. Leaving start index or end index undefined, will result in all of the data being returned.

```
  Response Body:
  [
      {
        totalCount: <number>,
        deviceData: {
            id: <string>,
            deviceId: <string>,
            createdAt: Date,
            [key: <string>]: any
        }
      },
        ...
  ]
```

-   `DELETE /api/deviceData/{id}`

## HTTP API endpoints

HTTP API port can be configured with `HTTP_PORT` in the `.env` file. (Default 7100)

### /{accessToken}

-   `POST /{accessToken}`

    ```
    Body:
    {
        [key: <string>]: any
    }
    ```

## CoAP API endpoints

CoAP API port can be configured with `COAP_PORT` in the `.env` file. (Default 7200)

### /{accessToken}

-   `POST /{accessToken}`

    ```
    Body:
    {
        [key: <string>]: any
    }
    ```
