# Data Model: User Authentication

## Overview
This model uses the standard Better Auth schema. Tables are managed by the Node.js Auth Server (via Better Auth migrations) but read by the Python Backend.

## Entities

### User (`user`)
*Managed by Auth Server*

| Field | Type | Description |
|---|---|---|
| `id` | String (UUID) | Primary Key. |
| `name` | String | User's display name. |
| `email` | String | User's email address (Unique). |
| `emailVerified` | Boolean | Whether email is verified. |
| `image` | String | URL to avatar. |
| `createdAt` | DateTime | Timestamp of creation. |
| `updatedAt` | DateTime | Timestamp of last update. |

### Session (`session`)
*Managed by Auth Server, Read by Python Backend*

| Field | Type | Description |
|---|---|---|
| `id` | String (UUID) | Primary Key. |
| `userId` | String | Foreign Key to `User`. |
| `token` | String | The session token sent in cookies/headers. |
| `expiresAt` | DateTime | When the session becomes invalid. |
| `ipAddress` | String | (Optional) IP of the user. |
| `userAgent` | String | (Optional) User agent string. |

### Account (`account`)
*Managed by Auth Server (for OAuth)*

| Field | Type | Description |
|---|---|---|
| `id` | String (UUID) | Primary Key. |
| `userId` | String | Foreign Key to `User`. |
| `accountId` | String | ID from the provider (e.g., Google sub). |
| `providerId` | String | Provider name (e.g., "google"). |
| `accessToken` | String | OAuth access token. |
| `refreshToken` | String | OAuth refresh token. |
| `expiresAt` | DateTime | Token expiry. |
| `password` | String | (Optional) Hashed password if email/pass used. |

## Verification (`verification`)
*Managed by Auth Server (for Email Verification)*

| Field | Type | Description |
|---|---|---|
| `id` | String (UUID) | Primary Key. |
| `identifier` | String | Email or phone. |
| `value` | String | OTP or token value. |
| `expiresAt` | DateTime | Expiry. |
