# 🌐 Web API (ASP.NET Framework - ADO.NET Entity Framework)

This project is a **ASP.NET Web API (Non-Core)** built using **ADO.NET Entity Data Model (EDMX)**. It acts as the backend for the Online Quran Tutor system and manages all business logic, database operations, and API endpoints.

The system handles:

* Student, Tutor, Guardian management
* Scheduling system
* Lesson plans (Surah-based learning)
* Progress tracking
* Feedback and reviews
* Authentication via SQL Server

---

# Project Requirements

Before running the project, ensure the following are installed:

* Microsoft Visual Studio (2019/2022 recommended)

  * ASP.NET and Web Development workload
* .NET Framework (4.x)
* SQL Server (LocalDB / Express / Full)
* SQL Server Management Studio (SSMS)

---

# How to Run the Project (IMPORTANT)

⚠️ This project must be run as **Administrator** in Visual Studio due to permission requirements for:

* Local IIS / IIS Express
* File access (Recordings / Images uploads)
* Database connection handling

---

## Step 1: Open Project

Open:

```
webapi.slnx
```

OR open `webapi.csproj`

---

## Step 2: Run Visual Studio as Administrator

Right-click Visual Studio →
    **Run as Administrator**

---

## Step 3: Database Setup (SQL Server)

Before configuring the Web API, ensure your database is properly set up.

---

### Case 1: If Database Already Exists

If **QuranDB already exists in SQL Server**, then simply use it in your connection string:

```xml
Initial Catalog=QuranDB;
```

No further setup is required in this case.

---

### Case 2: If Database is NOT Created Yet

If the database is not available, then you must set it up first using the provided database scripts.

## Step 3.1: Navigate to Database Folder

Go to the database directory in your project:

```bash
cd C:\Online-Quran-Tutor\db
```

---

## Step 3.2: Read Database README

Open and follow instructions in:

```
db/README.md
```

This file contains:
- Table creation scripts
- CSV import steps
- Stored procedure setup (Lesson Plan system)
- Trigger setup (Scheduling system)

---

## Step 3.3: Create Database in SQL Server

Open SSMS and run:

```sql
CREATE DATABASE QuranDB;
GO

USE QuranDB;
GO
```

---

## Step 3.4: Run Database Scripts (IMPORTANT)

Execute the SQL files in order:

### Create Tables
```sql
TableQueries.sql
```

### Lesson Plan System (Stored Procedure)
```sql
stored-prodecure.sql
```

### Scheduling System (Triggers)
```sql
Trigger.sql
```

---

## Step 3.5: Import CSV Data (Quran Content)

Use SSMS Import Wizard or SQL commands:

- `Quran.csv`
- `surahs.csv`
- `Juz.csv`

These must be imported into their respective tables before running the system.

---

## Final Step: Use Database in Web API

After setup, update your connection string:

```xml
Initial Catalog=QuranDB;
```

---

# Step 4: Entity Framework (EDMX Model)

This project uses Database First Approach (ADO.NET Entity Model).

# Create / Update Model
Right-click Models Folder
Select:
Add → New Item → ADO.NET Entity Data Model
Choose:
EF Designer from database
Select:
SQL Server instance
QuranDB database
Select all required tables:
User
StudentSlot
TutorSlot
Slot
LessonPlan
Surah
Progress
Review
Enrollment
Finish wizard → it will generate:
Model1.edmx
Model1.Context.cs
Model1.tt files

---


# Step 5: Connect Model with SQL Server

After EDMX creation:

* Ensure connection string matches database
* Build project:

```bash
Build → Rebuild Solution
```

If errors appear:

* Check table names
* Check column mismatches
* Update model from database

---

#  Step 6: Update Context Usage in Controllers

Your controllers use:

```
Model1.Context
```

Example:

```csharp
Model1 db = new Model1();
```

---

## If Context Name Changes

If EDMX is regenerated:

* Old context may break
* Replace all references:

```csharp
Model1 → YourNewContextName
```

Use:

```
Find & Replace in All Files
```

---

# Step 7: Build & Verify Connection

## Build Project

```bash
Build → Rebuild Solution
```

---

## Verify Database Connection

If model is correct:

* No runtime errors
* Tables accessible
* Controllers return data

---

## Common Issues

### Column mismatch error

✔ Fix:

* Right click EDMX → Update Model from Database

---

### Build errors

✔ Fix:

* Clean solution
* Rebuild again

---

### Database not connecting

✔ Fix:

* Check connection string
* Ensure SQL Server is running

---

# Key Project Modules

## Users

* Student
* Tutor
* Guardian

## Learning System

* Surah selection
* Lesson plans (auto-generated)
* Progress tracking

## Scheduling System

* Slots management
* Tutor availability
* Student requests

## Communication

* WebRTC integration (handled via signaling server)

## Feedback System

* Ratings
* Reviews
* Badge system

---

# Important Notes

* Always run Visual Studio as **Administrator**
* Always ensure SQL Server is running
* Always rebuild EDMX after schema changes
* Keep connection string consistent
* Do not manually edit EDMX-generated files

---

# 👨‍💻 Author
## Muhammad Qais

* Software Engineer
* GitHub: [https://github.com/qais001-pr](https://github.com/qais001-pr) 