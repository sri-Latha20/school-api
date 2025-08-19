# School API (Deliverable 2)

This project provides a simple **REST API** for managing schools, including adding schools and listing schools near a location.  

## 🚀 Deployment (Live URL)

Base URL:  
https://school-api.onrender.com

yaml
Copy
Edit

---

## 📌 API Endpoints

### 1. Add School
**POST** `/addSchool`

**Request Body (JSON)**:
```json
{
  "name": "ABC High School",
  "address": "123 Main Street, Hyderabad",
  "latitude": 17.385044,
  "longitude": 78.486671
}
Response:

json
Copy
Edit
{
  "message": "School added successfully",
  "schoolId": 1
}
2. List Nearby Schools
GET /listSchools?lat=17.38&lon=78.48

Response:

json
Copy
Edit
[
  {
    "id": 1,
    "name": "ABC High School",
    "address": "123 Main Street, Hyderabad",
    "latitude": 17.385044,
    "longitude": 78.486671
  }
]
🛠️ Running Locally
1. Clone the repo
bash
Copy
Edit
git clone https://github.com/your-username/school-api.git
cd school-api
2. Install dependencies
bash
Copy
Edit
npm install
3. Setup database
Run the SQL script in sql/schema.sql:

sql
Copy
Edit
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8)
);
Update .env with your MySQL credentials:

ini
Copy
Edit
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=schooldb
4. Start server
bash
Copy
Edit
npm start
Server runs at:

arduino
Copy
Edit
http://localhost:3000
📬 Postman Collection
Import the file SchoolAPI.postman_collection.json into Postman to test the endpoints easily.

✅ Deliverables
Live API endpoints:

POST https://school-api.onrender.com/addSchool

GET https://school-api.onrender.com/listSchools?lat=17.38&lon=78.48

Postman collection: SchoolAPI.postman_collection.json

SQL schema: sql/schema.sql

Source code: src/ folder

Instructions: README.md