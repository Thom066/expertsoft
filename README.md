#expertsoft

## Description
I developed this system to manage clients, platforms, invoices, and transactions using Node.js, Express, and PostgreSQL.  
allows to perform CRUD operations, import CSV files into the database, and execute advanced.  

---

## How to Run the Project?

1. Clone the repository
   git clone 
   cd expertsoft

2. Install dependencies

    npm install

3. Create the .env file with your database credentials:

PGHOST=localhost
PGUSER=thomas
PGPASSWORD=12345
PGDATABASE=expertsoft
PGPORT=5432

PORT=3000

4. Create the database and tables
I used the provided SQL script in /db/schema.sql to create all the tables in PostgreSQL.

5. Run the server

npm run dev

6. Test the API
 I opened Postman and tested:

http://localhost:3000/api/clients

## Technologies Used

Node.js

Express.js – Web framework

PostgreSQL – Relational database

pg – PostgreSQL client for Node.js

Multer – For CSV upload handling

Bootstrap – For simple frontend styling

dotenv – Environment variables

Nodemon – Auto restart during development

## Database Normalization
I normalized the database to Third Normal Form (3NF)

![alt text](<Captura desde 2025-08-12 21-47-01-1.png>)

## Bulk Import from CSV
I implemented an endpoint to upload CSV files and insert data into the database automatically.

Steps I followed:

Prepared CSV files with the correct structure and column names.

Sent them through Postman using the endpoint:

POST http://localhost:3000/api/import/{tableName}

Selected form-data in the body and uploaded the CSV file in the file field.

 Advanced Queries
Total Paid by Client

GET /api/reports/total-paid-by-client
Retrieves the total amount paid by each client.

Pending Invoices with Last Transaction Info

GET /api/reports/pending-invoices
Lists pending invoices along with the latest transaction data.

Transactions by Platform

GET /api/reports/transactions-by-platform?platform=PlatformName
GET /api/reports/transactions-by-platform?id_platform=1
Returns transactions filtered by platform name or platform ID.


 Developer Information
Name: Thomas Noriega

Clan: Berners lee

Email: thomasnzcp78@gmail.com