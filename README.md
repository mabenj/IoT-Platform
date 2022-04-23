# IoT-Platform

A simple and lightweight IoT platform made as part of Communication Technologies and Security in IoT course.

## Prerequisites

- node
- npm or yarn
- TypeScript
  `npm install -g typescript`

## Installation

1. `git clone`
2. `yarn install` or `npm install`
3. `yarn build` or `npm build`
4. `yarn start` or `npm start`

## Development

1. `git clone`
2. `yarn install` or `npm install`
3. `yarn run dev` or `npm run dev`

## Web API endpoints

Web API port is defined in the `src/config/web-api.config.ts` file.

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

- `PUT /api/devices`

  ```
   Body:
   {
       id: <string>,
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

HTTP API port is defined in the `src/config/http-api.config.ts` file.

- `POST /{accessToken}`

  ```
  Body:
  {
      [key: <string>]: any
  }
  ```

## CoAP API endpoints

CoAP API port is defined in the `src/config/coap-api.config.ts` file.

- `POST /{accessToken}`

  ```
  Body:
  {
      [key: <string>]: any
  }
  ```
