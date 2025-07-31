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