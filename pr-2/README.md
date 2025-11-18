# Practical Task 2 - Asynchronous Programming

## Tasks

### 1. Migrate to asynchronous Read/Write operations

In previous _Practical Task_ you've already implemented Read/Write operations to save your students data. By using asynchronous methods from `fs` module make sure that all I/O operations are asynchronous.

Node.js built-in `fs` module provides you two options here:

- [_Callback API_](https://nodejs.org/docs/latest/api/fs.html#callback-api) which allows you to work asynchronously by passing handler callbacks as a parameter to their function.
- [_Promises API_](https://nodejs.org/docs/latest/api/fs.html#promises-api) (_Recommended_) which converts same set of functions but wrapped with `Promise`.

Don't forget to handle returned result and potential errors.

### 2. Implement asynchronous data backup

Your Student Management System needs to be prepared for situations when something unexpected happens during the runtime. It may be either some fatal error in your program, OS, or even hardware.

Having a primitive mechanism for periodical data preservation will allow you to restore latest version of data which was loaded to your memory during the runtime.

Requirements:

- `setInterval` is used for triggering the backup operation
- when `setInterval` is triggered - it should take current array of student's you're working with and save it to JSON file.
- There should be a method which stops backup process
- Backup operation should create a separate JSON file with timestamp in name, that ends with `.backup.json`
- Log a message into your terminal once the backup operation is done or failed.

It is expected that at the end there will be a new directory where all `.backup.json` files will be stored.

> It is highly recommended to implement this functionality in scope of a separate class

### [ * ] 3. Add a protection mechanism

Protect your backup process from stacking unfinished I/O operations.

There may be an unexpected scenario when writing backup data to a file might take more time than expected.

Since backup operation works in interval-ish manner it is better to prevent it from running new I/O operations until the pending one is not yet finished.

Requirements:

- If `setInterval` is triggered but the I/O operation from previous interval is pending and hasn't yet resolved - do not initiate a new I/O operation.
- If pending I/O iteration lasts `3` intervals in a row - throw an error.

### 4. Cover your logic with EventEmitter

#### 1. Cover student management operations with EventEmitter

Cover all functions/methods which are related to interaction with students data with `EventEmitter`.

Events should be emitted with custom names. Make sure you're listening to these events.

#### 2. Cover data backup with EventEmitter

Instead of logging - emit custom event when backup operation is done.

Make sure you're listening to these events.

### [ * ] 5. Implement data-backup reporter

For this task you should have a backup mechanism implemented, which stores students data into JSON files with timestamp in their name.

Implement a reporter mechanism which will read all your log files from your backup-directory and print out the following common statistics:

- Amount of backup files.
- The latest created backup file + parse timestamp into readable datetime.
- Group students by id and display total amount of in all backup files.

Example:

```json
[
  { "id": "xyz", "amount": 20 },
  { "id": "qwe", "amount": 32 },
  { "id": "rty", "amount": 13 }
  // ...
]
```

- The average amount of students in all the files.

---

Useful links:

- [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [fsPromises.readFile](https://nodejs.org/docs/latest/api/fs.html#fspromisesreadfilepath-options)
- [fsPromises.readdir](https://nodejs.org/docs/latest/api/fs.html#fspromisesreaddirpath-options)

---

## Theoretical questions

1. What is the traditional way to handle asynchronous operations in JavaScript?
2. Explain Promise lifecycle.
3. Explain `Promise.all()`.
4. Explain `Promise.allSettled()`.
5. Explain `Promise.race()`.
6. Explain `Promise.any()`.
7. What is `Stream`? Name use-cases to where it can be used.
8. What is blocking operation?
9. What is non-blocking operation?
10. Explain `EventEmitter`. How it works?
11. How Event Loop works in web browsers?
12. How Event Loop works in Node.js?
13. Explain `process.nextTick()`. At which moment of Event Loop it executes?
14. Explain `setImmediate()`. At which moment of Event Loop it executes?

## Evaluation criteria [**Updated**]

### Practical Part

| Nr.        | pts |
| ---------- | --- |
| Task 1     | 1   |
| Task 2     | 3   |
| **Task 3** | 1   |
| Task 4     | 2   |
| **Task 5** | 1   |

In Total: **8 pts**

### Theoretical Part [**Updated**]

You should expect at least 2 questions if your practical part is done by 8 pts. In that case each question you've answered well is **+1 pt**.

To be evaluated you need to answer to at least one question correctly, Otherwise theory part would not be counted.

### Final Mark

**Practical part** (max 8 pts) + **Theoretical Part** (max 2 pts) = 10.
