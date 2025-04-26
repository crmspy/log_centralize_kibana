# Sample Log Centralization using Filebeat, Kibana, and Node.js with Winston

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Docker](https://img.shields.io/badge/Docker-20.x-blue)

---

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Setup Instructions](#setup-instructions)
- [Service Management](#service-management)
- [Testing](#testing)
- [Notes](#notes)

---

## Overview

This project provides a sample setup for centralized logging using:

- **Node.js** with **Winston** logging library
- **Filebeat** for shipping logs
- **Elasticsearch** for storing logs
- **Kibana** for visualizing logs

Logs are generated in JSON format using Winston, collected by Filebeat, and visualized through Kibana.

---

## Requirements

- Node.js 20.x
- Docker & Docker Compose

---

## Setup Instructions

1. **Install Node.js dependencies:**

   ```bash
   npm install
   ```

2. **Start Docker services:**

   ```bash
   docker-compose up -d
   ```
   or
   ```bash
   docker compose up -d
   ```

3. **Access Kibana:**

   Open your browser and navigate to:
   ```
   http://localhost:5601
   ```

---

## Service Management

- **Restart Filebeat after updating configuration:**

   ```bash
   docker-compose restart filebeat
   ```

- **Stop all services:**

   ```bash
   docker-compose down
   ```

---

## Testing

You can test the logging system by hitting the following endpoints:

- Normal access:
  ```
  http://localhost:3000/
  ```

- Error simulation:
  ```
  http://localhost:3000/error
  ```

- Access with a specific user ID:
  ```
  http://localhost:3000/user/uid123
  ```

Logs generated from these requests will be collected by Filebeat and displayed in Kibana.

---

## Notes

- Ensure your logs are properly formatted in JSON so Filebeat can parse and ship them correctly.
- In Kibana, create an index pattern matching `filebeat-*` to view your log data.
- You can customize the log fields such as `traceId`, `userId`, and `errorCode` for better searchability in Kibana.

---

Happy Logging! :rocket:

