# Project Specification: Cs516 Group7 Dice Game with AWS Integration

## 1. Project Overview

This project is a two-player dice game implemented as a Single Page Application (SPA) using HTML, CSS, and JavaScript. The game integrates with AWS serverless architecture for user authentication and score persistence.

## 2. Functional Requirements

### 2.1 Game Rules

- Two players take turns rolling a dice.
- If the player rolls any number other than 1, the number is added to their current score.
- If the player rolls a 1, they lose their turn and the current score resets to 0.
- A player can choose to "Hold" to save the current score to their total score.
- First player to reach or exceed 100 wins the game.
- After a game ends, the scores are saved to a backend system.

### 2.2 User Authentication

- Users authenticate via Amazon Cognito Hosted UI.
- Upon successful login, an `id_token` (JWT) is extracted from the URL and stored locally.
- All game score submissions require a valid bearer token.

### 2.3 Save Score

- When the game ends, the final scores are sent via an authenticated POST request to an AWS API Gateway endpoint.
- The API Gateway invokes a Lambda function that stores scores in a DynamoDB table.

## 3. Technical Architecture

### 3.1 Frontend

- **Stack:** HTML, CSS, JavaScript (Vanilla)
- **Hosting:** Amazon S3 (Static Website) + CloudFront (CDN)
- **Login Flow:** Cognito Hosted UI → Redirect with Token → LocalStorage

### 3.2 Backend (AWS)

| Component          | Purpose                                |
| ------------------ | -------------------------------------- |
| **Amazon Cognito** | User authentication and token issuance |
| **API Gateway**    | Secure HTTP endpoints for the frontend |
| **AWS Lambda**     | Process game score submissions         |
| **DynamoDB**       | Store player scores as items           |

### 3.3 API Details

#### Endpoint: `POST /saveGame`

- **Authentication:** JWT via `Authorization: Bearer <token>`
- **Headers:** `Content-Type: application/json`
- **Payload:**

```json
{
  "player1Score": 112,
  "player2Score": 67
}
```

- **Response:**

```json
{
  "message": "Game saved successfully."
}
```

## 4. Database Design (DynamoDB)

### Table Name: `GameScores`

| Attribute      | Type   | Description                         |
| -------------- | ------ | ----------------------------------- |
| `gameId`       | String | UUID for each game (Primary Key)    |
| `username`     | String | Username extracted from Cognito JWT |
| `player1Score` | Number | Final score of Player 1             |
| `player2Score` | Number | Final score of Player 2             |
| `timestamp`    | String | ISO 8601 timestamp                  |

- **Primary Key:** `gameId` (Partition Key)

## 5. Lambda Function Design

### Function Name: `saveGameLambda`

#### Environment Variable

- `TABLE_NAME = GameScores`

#### Code (JavaScript)

```javascript
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const db = new DynamoDBClient({ region: 'us-east-1' });

export const handler = async (event) => {
  try {
    // Step 1: Get and decode the id_token
    const token = event.headers.Authorization.split(' ')[1];
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));

    const username = payload['cognito:username'] || payload['email'];
    if (!username) throw new Error('Missing username in token.');

    // Step 2: Parse game scores from request body
    const body = JSON.parse(event.body);
    const { player1Score, player2Score } = body;

    // Step 3: Create item
    const item = {
      gameId: { S: uuidv4() },
      username: { S: username },
      player1Score: { N: player1Score.toString() },
      player2Score: { N: player2Score.toString() },
      timestamp: { S: new Date().toISOString() }
    };

    // Step 4: Save to DynamoDB
    await db.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME || 'GameScores',
        Item: item
      })
    );

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://d35r1khkyagqly.cloudfront.net',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization'
      },
      body: JSON.stringify({ message: 'Game saved successfully.' })
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://d35r1khkyagqly.cloudfront.net',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization'
      },
      body: JSON.stringify({ error: 'Failed to save game.' })
    };
  }
};
```

## 6. Security

- CORS enabled in API Gateway to allow requests from CloudFront domain.
- Lambda responses include CORS headers.
- Authorization is enforced using Cognito JWT authorizer in API Gateway.

## 7. Environment Details

| AWS Region  | Service Usage                                          |
| ----------- | ------------------------------------------------------ |
| `us-east-1` | Cognito, Lambda, API Gateway, S3, DynamoDB, CloudFront |

---

**Last Updated:** June 13, 2025
