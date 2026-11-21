# NexusFlow – Week 1 Day 6 Testing Report

## Role
MongoDB & Time-Series Database Developer

## 1. Database Configuration
- Database: MongoDB Atlas
- Database name: `nexusflow`
- Collection: `telemetry`
- Collection type: Time-Series
- Time field: `timestamp`
- Metadata field: `metadata`
- MongoDB Node.js Driver: Native driver

## 2. Implemented Components
- MongoDB connection configuration.
- Time-Series collection initialization.
- Telemetry document validation and creation.
- Single telemetry insertion.
- Bulk telemetry insertion.
- Telemetry retrieval with newest-first sorting.
- Database connection cleanup using `closeDB()`.

## 3. Testing Performed

### A. Bulk Insertion Test
File: `backend/tests/bulk-telemetry.test.js`

- Tested insertion of multiple telemetry records.
- Successfully inserted 3 records into MongoDB Atlas.

### B. Retrieval Test
File: `backend/tests/retrieve-telemetry.test.js`

- Retrieved telemetry records from MongoDB Atlas.
- Successfully retrieved 5 existing records.
- Verified newest-first sorting.
- Verified database connection cleanup.

### C. Model and Service Validation
File: `backend/tests/telemetry-validation.test.js`

Successfully tested:
1. Valid telemetry data.
2. Missing device ID.
3. Invalid timestamp.
4. String telemetry value.
5. NaN telemetry value.
6. Infinite telemetry value.
7. Empty bulk array.
8. Non-array bulk input.
9. Invalid record in bulk input.
10. Invalid retrieval limits.

Result: All 10 validation tests passed.

### D. Database Error Handling
File: `backend/tests/database-error.test.js`

Successfully tested:
- Database access when disconnected.
- Telemetry storage when the database is disconnected.

Result: Both tests passed.

## 4. Test Commands

Run from the project root:

```powershell
node .\backend\tests\bulk-telemetry.test.js
node .\backend\tests\retrieve-telemetry.test.js
node .\backend\tests\telemetry-validation.test.js
node .\backend\tests\database-error.test.js
```

The first two tests require a working MongoDB Atlas connection. The validation and database-error tests can run without connecting to Atlas.

## 5. Team Responsibility

My responsibility:
- MongoDB connection and configuration.
- Time-Series collection setup.
- Telemetry model and validation.
- Telemetry storage service.
- Bulk insertion and retrieval.
- Database testing and documentation.

Express routes, API endpoints and controllers are handled by Anshu.

## 6. Week 1 Outcome

Completed the MongoDB Time-Series database setup, telemetry model, storage operations, bulk insertion, retrieval functionality, validation tests, database error handling and technical documentation.

**Status: Week 1 MongoDB and Time-Series Database tasks completed.**