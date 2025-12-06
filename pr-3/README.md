# Practical Task 3 - Migrating to HTTP Server

From this moment you will start working with HTTP servers and will create your own API to work with Students Management System.

**NOTE:** `[Basics]` tasks are expected to be implemented without using any external libraries and/or frameworks.

## Preparations

To make it easier for you to test API endpoints on your Node.js web server you will need an API client.

Some API clients you can use:

- [Postman](https://www.postman.com/downloads/) - requires to have an account in order to use most of it's features which it not always a good option. Has useful well-working features which other API clients does not have yet.

- [Bruno](https://www.usebruno.com/) - does not require to make an account. Has everything you need for testing your API. Considered the best Postman alternative.

- [Hoppscotch](https://hoppscotch.io/)

- [httpie](https://httpie.io/)

> There are even more alternatives with their unique pros and cons which you can find on the internet

## Tasks

### 1. [Basics] Create a simple HTTP Server

Using `http` built-in Node.js module, create a simple HTTP server that listens for a port `3000` and returns you a simple response with HTML if you're trying to reach `http://localhost:3000/`:

```html
<h1>Hello World</h2>
```

Check how your app works using your API client.

### 2. [Basics] Display request details

Based on the code from the first task - update the code which returns you the request details - HTTP Method, URL, HTTP version, request headers, etc.

Return these details in HTML format.

### 3. [Basics] Return HTML page

Prepare HTML file and fill it with some of your information so it may look (for example) like CV.

Correctly return your file so that it will be displayed correctly in your browser by calling `http://localhost:3000/`.

#### 3.1 [Basics] [Bonus Task] Handle static paths (+ 1pt)

If you are interested in doing more - try to make your HTTP server to return not only `.html`, but also additional static files which are linked to you `.html` file (`.css`, `.js`, favicon, other images).

Files to which `.html` file refers should be stored locally on your machine. Node.js HTTP server should listen to requests which HTML page will make automatically during the page-loading-stage and return requested files from your filesystem.

### 4. Migrate Student Management System logic to HTTP server

Take the functionality implemented in `pr-1` and `pr-2`, and migrate it to HTTP Server so you can work with Student Management System via HTTP requests.

You will work with complex path tree and path parameters. Install `express` framework and build your API using it's features.

#### 4.1 Create endpoints for manipulation with Students collection

Align your methods with endpoints and write additional logic if necessary.

Recommended paths for your API:

| Path                        | Functionality                                             |
| --------------------------- | --------------------------------------------------------- |
| `/api/students`             | Get all students                                          |
| `/api/students`             | Add new student                                           |
| `/api/students`             | Completely replace old students collection with a new one |
| `/api/students/:id`         | Get student by ID                                         |
| `/api/students/:id`         | Update existing student by ID                             |
| `/api/students/:id`         | Remove existing student by ID                             |
| `/api/students/group/:id`   | Get all students by specific group id                     |
| `/api/students/average-age` | Calculate average age of your students                    |
| `/api/students/save`        | Save students to JSON file                                |
| `/api/students/load`        | Load students from JSON file                              |

> Make sure that you are using correct HTTP methods for each of your endpoints.

Make sure to:

- Use correct HTTP Method
- Return correct HTTP Status Code
- Return result in JSON format
- Handle errors correctly

#### 4.2 Migrate backup logic to HTTP Server

Align your methods with endpoints and write additional logic if necessary.

| Path                 | Functionality                                                   |
| -------------------- | --------------------------------------------------------------- |
| `/api/backup/start`  | Start backup mechanism                                          |
| `/api/backup/stop`   | Stop backup mechanism                                           |
| `/api/backup/status` | Return current status of the backup mechanism (running/stopped) |

> Make sure that you are using correct HTTP methods for each of your endpoints.

Make sure to:

- Use correct HTTP Method
- Return correct HTTP Status Code
- Return result in JSON format
- Handle errors correctly

### 5. [Bonus Task] Connect Backend with Frontend (+2 pts)

In this task you are free to implement your Frontend application as a separate project using any framework/library you want. No restrictions.

You are expected to interact with the data, display it and reflect all changes in students collection accordingly.

#### Acceptance Criteria

Your application:

- Interacts with all existing API endpoints
- Handles API errors correctly

### Useful links

- [Node.js HTTP module](https://nodejs.org/api/http.html)
- [Express Framework](https://expressjs.com/)
  - [Getting Started](https://expressjs.com/en/starter/installing.html)
- [HTTP Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods)
- [HTTP Response Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)
- [Common Media Types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/MIME_types/Common_types)
  - [Media Types - IANA](https://www.iana.org/assignments/media-types/media-types.xhtml)
- [Content-Type header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Type)

### Theoretical Part

1. What is a client-server relationship model?
2. Explain OSI model.
3. Explain TCP/IP model.
4. What are the differences between OSI and TCP/IP models?
5. To which layers of OSI module Node.js has an access?
6. What is IP Address?
7. What is Port?
8. Name common port numbers and associated services with them.
9. What is a Protocol?
10. Name common network protocols?
11. Explain TCP.
12. Explain UDP.
13. Explain HTTP.
14. Explain differences between HTTP and HTTPS.
15. What are the differences between TCP and UDP?
16. Which Node.js built-in module allows you to create TCP server?
17. Which Node.js built-in module allows you to create UDP server?
18. Which Node.js built-in module allows you to create HTTP server?
19. Which Node.js built-in module allows you to create HTTPS server?
20. Explain HTTP request/response structure.
21. Explain HTTP Methods.
22. Explain HTTP Status Codes.
23. Which mechanisms helps to resolve stateless nature of HTTP?
24. What is an API?
25. What is REST?
26. Explain REST core principles.
27. Name other known architectural styles except REST?

## Evaluation criteria [**Updated**]

- From now on, all practical tasks that are not marked as an _extra task_ are considered the bare minimum. Completing them all is worth **5 pts**.

- The rest of the evaluation will depend on whether extra tasks are completed and how well the student will answer the theoretical part.

- The number and complexity of theoretical questions will depend on how well the student will answer these questions during the process.

- If student fails to answer theoretical part, the final mark may remain at **5 pts**.

### Bonuses

Following the criteria listed below will help you achieve a higher mark, being asked less theoretical questions and gain more loyalty overall:

1. Your work is submitted in time. No delays.
2. You have completed maximum amount of bonus tasks.
3. Your solutions are reasonable.
4. Your code is clean, well-organized and well-documented.
5. Teacher can see that you answer questions confidently and without long delays.

### Penalties

If the submitted code is suspected of being artificially generated and/or copy-pasted, the work will be either returned with **0 pts** or the student will be asked to explain their code in detail. If student fails to explain their code, the practical task is considered as failed and will be returned with **0 pts**.
