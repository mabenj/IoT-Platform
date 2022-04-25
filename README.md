# IoT-Platform

A simple and lightweight IoT platform made as part of Communication Technologies and Security in IoT course.

## Prerequisites

- node
- npm or yarn
- TypeScript
  `npm install -g typescript`

## Installation

1. `git clone`
2. `npm install`
3. `npm run build`
4. `npm start`

## Development

1. `git clone`
2. **Back-end**

   2.1 `npm install`

   2.2 `npm run dev`

3. **Front-end**

   3.1 `cd src/client-app`

   3.2 `npm install`

   3.3 `npm start`

## Database Connection

Connection to MongoDB requires the following in a `.env` file in the root directory

`MONGO_USERNAME=<username>`

`MONGO_PASSWORD=<password>`

`MONGO_HOST=<host (e.g. cluster0.jrhsd.mongodb.net/iot-platform)>`

## Web API endpoints

Web API port is defined in the `src/configs/web-api.config.ts` file.

### /api/devices

- `GET /api/devices`

- `GET /api/devices/{id}`

- `POST /api/devices`

  ```
   Body:
   {
       name: <string>,
       accessToken: <string>,
       enabled: <boolean>,
       protocol: "http" | "coap"
    }
  ```

- `PUT /api/devices/{id}`

  ```
   Body:
   {
       name?: <string>,
       accessToken?: <string>,
       enabled?: <boolean>,
       protocol?: "http" | "coap"
   }
  ```

- `DELETE /api/device/{id}`

### /api/deviceData

- `GET /api/deviceData/{id}`

- `DELETE /api/deviceData/{id}`

## HTTP API endpoints

HTTP API port is defined in the `src/configs/http-api.config.ts` file.

- `POST /{accessToken}`

  ```
  Body:
  {
      [key: <string>]: any
  }
  ```

## CoAP API endpoints

CoAP API port is defined in the `src/configs/coap-api.config.ts` file.

- `POST /{accessToken}`

  ```
  Body:
  {
      [key: <string>]: any
  }
  ```
