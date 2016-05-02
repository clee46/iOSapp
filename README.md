# ClosetX REST API

## Table of Contents
* [User Accounts](#auth)
  * [Creating a New User](#signup)
  * [Logging in to Existing User](#login)
  * [Updating User Profile](#profile)
* [Working With Items](#items)
  * [Creating a New Item](#createItem)
  * [Retrieving a User's Items](#getItems)
  * [Updating an Existing Item](#updateItem)
  * [Deleting an Existing Item](#deleteItem)
* [Connecting to Other Users](#connections)
  * [Sending a Connection Request](#request)
  * [Retrieving Pending Requests](#pending)
  * [Retrieving Accepted Requests](#connected)
  * [Accepting a Request](#accept)
  * [Deleting a Connection](#delete)


## <a id="auth"></a> Signup and Login

### <a id="signup"></a>Creating a New User

Send a POST request to base_URL/api/signup where the request body looks like this:

```js

{
    "first": "John",
    "last": "Doe",
    "username": "johndoe46",
    "email": "john@doe.com",
    "password": "password",
    "confirmpassword": "password"
}

```

If the user already exists in the database (i.e. the username or e-mail already exists), the server will respond with status 400 and the following message:

```js

{
  "msg": "User Already Exists"
}

```

The server will also respond with status 400 and corresponding message for the following error cases:

* E-mail not provided
* E-mail field was not a valid e-mail address
* First name not provided
* Last name not provided
* Username not provided
* Password not long enough
* "password" and "confirmpassword" properties do not match

### <a id="login"></a>Logging into an existing user

Send a GET request to base_URL/api/login where the request header looks like this:

```js

{
  "Authorization": "Basic dXNlckQvbmUuY29tOnChc3N3b3Jk"
}

```
The part of the authorization string following "Basic " is created by encoding the user's login credentials in base64.  For example, to obtain the authorization string for a user with the following credentials:

* email: test@test.com
* password: password

one would perform base64 encoding on the following string: "test@test.com:password", followed by concatenating to the word "Basic" with a space in the middle.

If the login credentials match those of a user in the database, the server will respond with status 200 and the following JSON object:

```js
{
  "msg": "Logged in successfully!",
  "token": login_token
}
```
where the login_token is a unique string generated by the server for the user.  The token can then be used to access all routes that require a logged in user.  

The server responds with status 401 and the following messages if the user does not exist or if the user does exist but the password does not match:

```js

{
  "msg": "User Does Not Exist"
}

{
  "msg": "Incorrect Password"
}

```

### <a id="profile"></a>Updating User Profile

## <a id="items"></a> Working With Items

All item routes are protected.  A user must be logged in and attach their authorization token to the request header like this:

```js
{
    "token": authorization_token
}
```

###<a id="createItem"></a>Creating a New Item

Send a POST request to base_URL/api/items where the request body looks like this (don't forget to assign the authorization token to the request header as shown above):

```js
{
    "description": "The Item Description",
    "size": "small",
    "color": "blue",
    "imageUrl": "http://www.image.com/image.jpg"
}
```
If successful, the server will respond with status 200 and the following:

```js
{
  "__v": 0,
  "userId": "571fb27d04ca4f4e1b93a51a",
  "description": "User One's Fourth Item",
  "_id": "5721017d52d7ba40074c16a3"
}
```

This is a protected route.  Without a correct token, the server will respond with status 401 and the following message:

```js
{
  "msg": "Unable to decode token"
}
```

### <a id="getItems"></a>Retrieving a User's Items

Send a GET request to base_URL/api/items. Don't forget to assign the authorization token to the request header as shown above.

The server will respond with an array of JSON objects (or an empty array if the user has zero items).  For example:

```js
[
  {
    "_id": "571fb933c8b23e7a1fa6992f",
    "userId": "571fb27d04ca4f4e1b93a51a",
    "description": "User One's First Item",
    "__v": 0
  },
  {
    "_id": "571fb93bc8b23e7a1fa69930",
    "userId": "571fb27d04ca4f4e1b93a51a",
    "description": "User One's Second Item",
    "__v": 0
  },
  {
    "_id": "571fb93fc8b23e7a1fa69931",
    "userId": "571fb27d04ca4f4e1b93a51a",
    "description": "User One's Third Item",
    "__v": 0
  }
]
```

### <a id="updateItem"></a> Updating an Existing Item

Send a PUT request to base_URL/api/items/:id where the request body looks like this (don't forget to assign the authorization token to the request header as shown above):

```js
{
    "description": "The Updated Description",
    "size": "updated size",
    "color": "updated color",
    "imageUrl": "http://www.image.com/update.jpg"
}
```

If successful, the server will respond with status 200 and a simple success message.  However, if the current logged in user is not the one who created the item, then the item is not updated and a status 401 message is returned:


```js
{
  msg: 'You are not authorized to update this item'
}
```

### <a id="deleteItem"></a> Deleting an Existing Item

Send a DELETE request to base_URL/api/items/:id. Don't forget to assign the authorization token to the request header as shown above.

If successful, the server will respond with status 200 and a simple success message.  However, if the current logged in user is not the one who created the item, then the item is not updated and a status 401 message is returned:

```js
{
  msg: 'You are not authorized to delete this item'
}
```

## <a id="connections"></a> Connecting to Other Users

All connection routes are protected.  A user must be logged in and attach their authorization token to the request header like this:

```js
{
    "token": authorization_token
}
```

### <a id="request"></a> Sending a Connection Request

Send a POST request to base_URL/api/connections. Don't forget to assign the authorization token to the request header as shown above.

```js
{
  "userId": "571fb29204ca4f4e1b93a51b"
}
```

### <a id="pending"></a> Retrieving Pending Requests

Send a GET request to base_URL/api/pending. Don't forget to assign the authorization token to the request header as shown above.

Server responds with an array of Connection objects with an added property "username" indicating the username of the user who sent the invitation request.

```js
[
  {
    "_id": "57278323e017a2de0430bc87",
    "user2": "571fb29204ca4f4e1b93a51b",
    "user1": "571fb27d04ca4f4e1b93a51a",
    "__v": 0,
    "accepted": false,
    "username": "requester"
  }
]

```

### <a id="connected"></a> Retrieving Accepted Requests

Send a GET request to base_URL/api/connections. Don't forget to assign the authorization token to the request header as shown above.

### <a id="accepted"></a> Accepting a Request

Send a PUT request to base_URL/api/connections/:id. Don't forget to assign the authorization token to the request header as shown above.

### <a id="delete"></a> Deleting a Connection

Send a DELETE request to base_URL/api/connections/:id. Don't forget to assign the authorization token to the request header as shown above.
