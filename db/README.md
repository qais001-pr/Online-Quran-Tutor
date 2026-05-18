## Database Setup (SQL Server + Quran Data)

This project uses **Microsoft SQL Server** along with SQL scripts and CSV files to manage Quran data, lesson planning, and scheduling logic for Students, Tutors, and Guardians.

---

# Database Structure

```
db/
│
├── TableQueries.sql
├── stored-prodecure.sql
├── Trigger.sql
├── README.md
│
└── csv/
    ├── Quran.csv
    ├── surahs.csv
    └── Juz.csv
```

---

# Step-by-Step Database Setup (SQL Server)

## Step 1: Open SQL Server Management Studio (SSMS)

* Open **Microsoft SQL Server Management Studio (SSMS)**
* Connect to your local or remote SQL Server instance

---

## Step 2: Create Database

Create a new database:

```sql
CREATE DATABASE QuranDB;
GO

USE QuranDB;
GO
```

---

## Step 3: Create Tables

Open and execute:

```sql
TableQueries.sql
```

### This will create tables for:

* Users (Student, Tutor, Guardian)
* Classes
* Scheduling System
* Quran Data (Surah, Juz, Ayah)
* Progress Tracking
* Feedback & Ratings

---

## Step 4: Import CSV Data (Quran Dataset)

You can import CSV files using **SSMS Import Wizard**:

### Method:

1. Right-click database → **Tasks**
2. Click **Import Flat File**
3. Select file from:

```
db/csv/Quran.csv
db/csv/surahs.csv
db/csv/Juz.csv
```

4. Map columns to tables:

   * Quran.csv → Quran table
   * surahs.csv → Surahs table
   * Juz.csv → Juz table

---

## Step 5: Stored Procedure (Lesson Plan System)

Run:

```sql
stored-prodecure.sql
```

### Purpose:

This stored procedure is responsible for:

* Generating **Lesson Plans for each Surah**
* Splitting Surah into structured learning sessions
* Helping Tutors follow a guided teaching plan
* Tracking student learning progress step-by-step

---

## Step 6: Trigger Setup (Scheduling System)

Run:

```sql
Trigger.sql
```

### Purpose:

Triggers automate scheduling logic:

* 📅 Auto-create class schedule when Student/Guardian selects availability
* 👨‍🏫 Match Tutor availability with Student time slots
* ❌ Prevent double booking of same time slot

### Example Flow:

1. Student/Guardian selects available time
2. System checks Tutor availability
3. If matched → Class is scheduled
4. If conflict → request is rejected automatically

---

## Step 7: Verify Database Setup

### Check Tables:

```sql
SELECT * FROM INFORMATION_SCHEMA.TABLES;
```

### Check Surah Data:

```sql
SELECT TOP 10 * FROM Surahs;
```

---

## Final Result

After successful setup:

* ✔ SQL Server database is configured
* ✔ Quran dataset is imported
* ✔ Lesson plan system (Stored Procedure) is active
* ✔ Scheduling system (Triggers) is active
* ✔ Backend is ready for integration with Web API