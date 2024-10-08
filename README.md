# Invoice Service

## Description

The Invoice Service is a crucial component of our e-commerce platform, responsible for managing invoices. Built using NestJS and following Domain-Driven Design (DDD) principles, this service handles invoice creation, retrieval, and management. It integrates with MongoDB for data persistence and Google Cloud Pub/Sub for event-driven communication with other services like the Order Service.

## Features

- Create new invoices
- Retrieve invoice details
- Update invoice status
- List all invoices
- Get invoice by order ID
- Send invoices
- Listen for and process order events

## Technologies Used

- Node.js (v14 or later)
- NestJS
- MongoDB
- Google Cloud Platform (Pub/Sub)
- TypeScript
- Docker

## Project Structure

The project follows a Domain-Driven Design architecture:

```
src/
├── application/
│   ├── dtos/
│   ├── handlers/
│   └── services/
│       └── invoice/
├── common/
│   └── pubsub/
├── domain/
│   ├── entities/
│   ├── enums/
│   ├── errors/
│   ├── events/
│   └── repository/
├── infrastructure/
│   ├── controllers/
│   │   └── invoice/
│   ├── exceptions/
│   ├── repositories/
│   └── schemas/
└── test/
```


## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-organization/order-service.git
   cd order-service
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   GOOGLE_CLOUD_PROJECT_ID=your_gcp_project_id
   GOOGLE_CLOUD_KEY_FILE=path_to_your_gcp_key_file.json
   TOPIC_NAME=your_pubsub_topic_name
   SUBSCRIPTION_NAME=your_pubsub_subscription_name
   ```
4. Set up Google Cloud credentials:
```
mkdir secrets
cp path/to/your/keyfile.json secrets/google_cloud_pubsub_key.json
```

## Running the Application with Docker

Build and run the services using Docker Compose:
```
docker-compose up --build
```


This will start the Order Service on port 3002 and MongoDB on port 27017.

5. To stop the services:

```
docker-compose down
```

## Running the Application locally

1. Install MongoDB Community Edition:
- For Ubuntu: Follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
- For other operating systems, refer to the [MongoDB documentation](https://docs.mongodb.com/manual/installation/)

2. Start MongoDB:

```
sudo systemctl start mongod
```

3. Run the application in development mode:
```
npm run start:dev
```

The service will be available at `http://localhost:3001/invoices`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /invoices | Create a new invoice |
| GET    | /invoices | List all invoices |
| GET    | /invoices/:id | Retrieve a specific invoice |
| GET    | /invoices/order/:orderId | Get invoice by order ID |
| PATCH  | /invoices/:id/send | Send an invoice |

For detailed API documentation, visit `/api-docs` when the service is running. (TODO)

## Testing

To run the test suite:

```
npm run test
```

For test coverage:

```
npm run test:cov
```
