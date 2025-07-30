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