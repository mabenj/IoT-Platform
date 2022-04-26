# IoT-Platform

A simple and lightweight IoT platform made as part of _Communication Technologies and Security in IoT_ course.

## Prerequisites

- node and npm
- TypeScript
  `npm install -g typescript`

## Installation

1. `git clone`
2. `npm install`
3. `npm run build`
4. Configure MongoDB connection (see [Database Connection](#database-connection))
5. `npm start`

## Development

1. `git clone`
2. **Back-end**

   2.1 `npm install`

   2.2 Configure MongoDB connection (see [Database Connection](#database-connection))

   2.3 `npm run dev`

3. **Front-end**

   3.1 `cd src/client-app`

   3.2 `npm install`

   3.3 `npm start`

## Database Connection

Connection to MongoDB requires the following entries in a `.env` file in the root directory

`MONGO_USERNAME=<username>`

`MONGO_PASSWORD=<password>`

`MONGO_HOST=<host (e.g. cluster1337.foobar.mongodb.net/iot-platform)>`

## Web API endpoints

Web API port can be configured with a `WEB_PORT` environment variable in the `.env` file. (Default 7000)

### /api/devices

- `GET /api/devices` Gets all the registered devices

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

- `GET /api/devices/{id}` Gets a registered device that has the corresponding id

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

- `POST /api/devices` Registers a new device provided in the request body

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

- `PUT /api/devices/{id}` Modifies a registered device that has the corresponding id with the details provided in the body

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

- `DELETE /api/device/{id}` Deletes a registered device that has the corresponding id

### /api/deviceData

- `GET /api/deviceData/{id}` Gets all the device data associated with a device that has the corresponding id

```
  Response Body:
  [
    {
        id: <string>
        deviceId: <string>,
        createdAt: Date
        [key: <string>]: any,
    },
    ...
  ]
```

- `DELETE /api/deviceData/{id}`

## HTTP API endpoints

HTTP API port can be configured with a `HTTP_PORT` environment variable in the `.env` file. (Default 7100)

- `POST /{accessToken}`

  ```
  Body:
  {
      [key: <string>]: any
  }
  ```

## CoAP API endpoints

CoAP API port can be configured with a `COAP_PORT` environment variable in the `.env` file. (Default 7200)

- `POST /{accessToken}`

  ```
  Body:
  {
      [key: <string>]: any
  }
  ```
