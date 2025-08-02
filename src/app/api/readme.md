# API Documentation

## Endpoint: `/api/auth/sign-up`

### Description
This endpoint registers a new user. It performs the following actions:

- Checks if the username is already taken by a verified user.
- Checks if the email is already used by another user:
  - If used by a verified user, registration is blocked.
  - If used by an unverified user, the record is updated.
- If the email is new, a new user is created.
- Generates a 6-digit verification code with 1-hour expiry.
- Hashes the password before storing.
- Sends a verification email containing the code.

### Method
`POST`

### Request Body

Send a JSON object with the following fields:

- `username`: A unique string (required)
- `email`: A valid email address (required)
- `password`: A string with a secure password (required)

#### Example
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```
#### Example Response
```json
{
    "success": true,
    "message": "User registered successfully. Please verifyyouremail"
}
```
## Endpoint: `/api/auth/check-username-unique?username=xyz`

### Description
This endpoint is used to check whether a given username is unique. It accepts a query parameter username and verifies if the username already exists in the database for a verified user. Username must not contain unique charecters(@, #, $, etc).

### Method
`GET`

### Query Parameters
- `username:`A unique string (required)

### Example Request
```json
/api/auth/check-username-unique?username=delete100

```
#### Example Response
```json
{
  "success": true,
  "message": "Username is unique"
}

```
## Endpoint: `/api/auth/verify-code`

### Description
This endpoint is used to verify a user's email using a verification code. It checks whether the provided code matches the stored code and is not expired, then marks the user as verified.

### Method
`POST`

### Request Body

Send a JSON object with the following fields:

- `username`: A unique string (required)
- `code`:  A string containing the 6-digit verification code sent to the user's email (required)

### Example Request
```json
{
  "username": "avijit_user",
  "code": "123456"
}
```
#### Example Response
```json
{
  "success": true,
  "message": "Account verified successfully"
}
```
## Endpoint: `/api/accept-messages`

### Description
This endpoint updates the message acceptance preference (isAcceptingMessages) for the authenticated user.

### Method
`POST`

### Request Body

Send a JSON object with the following fields:

- `acceptMessages:` A boolean indicating whether the user wants to receive messages (required)

### Example Request
```json
{
    "isAcceptingMessages": true
}
```
#### Example Response
```json
{
  "success": true,
  "message": "Message acceptance status updated successfully",
  "updatedUser": {
    "_id": "user_id_here",
    "username": "example_user",
    "isAcceptingMessages": true,
    ...
  }
}
```
## Endpoint: `/api/accept-messages`

### Description
This endpoint retrieves the current user's message acceptance status (isAcceptingMessages). It requires the user to be authenticated via session.

### Method
`GET`

### Example Request
No body required.

#### Example Response
```json
{
  "success": true,
  "isAcceptingMessages": true
}
```
## Endpoint: `/api/sned-message`

### Description
This endpoint allows anyone (unauthenticated) to send a message to a user if the user is accepting messages. The message is stored in the database and linked to the recipient user's account.

### Method
`POST`

### Request Body

Send a JSON object with the following fields:

- `username`: A unique string (required)
- `content:` A string containing the message text (required)

### Example Request
```json
{
  "username": "avijit_user",
  "content": "Hello! I love your work."
}
```

#### Example Response
```json
{
  "success": true,
  "message": "Message send successfully"
}
```
## Endpoint: `/api/get-messages`

### Description
This endpoint retrieves all messages sent to the authenticated user. The messages are returned in descending order of their creation time (newest first). The user must be logged in to access this route.

### Method
`GET`

### Authentication
- `✅ Required:` Uses NextAuth session. The request must be made by an authenticated user.

### Example Request
(No request body required)
Use a GET request with credentials (e.g., session cookie or token handled by NextAuth).

#### Example Response
```json
{
  "success": true,
  "messages": [
    {
      "_id": "64fd7b3f9fa0d1c3bca1c91e",
      "content": "Hey, just wanted to say I love your blog!",
      "createdAt": "2025-07-29T12:34:56.789Z"
    }
  ]
}
```