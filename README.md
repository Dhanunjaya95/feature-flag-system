# Feature Flag Management System

A web-based system that lets software companies control which features are turned ON or OFF for different organisations — without changing any code. Think of it like a light switch panel for your app features.

---

## What Problem Does This Solve?

Imagine you have a software product used by multiple companies. You want to enable a new feature (like dark mode) only for Company A but not Company B. Instead of writing separate code for each company, you just flip a switch in this system. That's what feature flags do!

---

## Who Uses This System?

There are 3 types of users:

**1. Super Admin (You — the software host)**
- Has one fixed login (no signup needed)
- Creates and manages organisations
- Can see all organisations in the system

**2. Organisation Admin (Your clients)**
- Signs up and belongs to one organisation
- Creates feature flags for their organisation
- Can turn flags ON or OFF
- Can edit or delete flags

**3. End User (The client's customers)**
- Selects their organisation
- Types a feature key
- Instantly sees if that feature is enabled or disabled

---

## How to Run This Project

### Step 1 — Make sure Node.js is installed
Open your terminal and type:
```
node -v
```
If you see a version number like `v20.x.x`, you're good. If not, download Node.js from https://nodejs.org

---

### Step 2 — Install dependencies
Navigate to the backend folder and install packages:
```
cd backend
npm install
```
Wait for it to finish. This installs everything the server needs.

---

### Step 3 — Start the server
```
node server.js
```
You should see:
```
Server running on http://localhost:3000
```
Keep this terminal open while using the app.

---

### Step 4 — Open the app
Go to the main project folder and open `index.html` in your browser.

You'll see a home page with 3 buttons — one for each portal.

---

## Login Credentials

**Super Admin:**
- Username: `superadmin`
- Password: `admin123`

---

## How to Use It (Full Flow)

1. Open `index.html` and click **Super Admin Portal**
2. Login with the credentials above
3. Create an organisation (e.g. "Acme Corp")
4. Note the Organisation ID shown (e.g. ID: 1)
5. Go back and click **Admin Portal**
6. Sign up using the organisation dropdown
7. Login and create a feature flag (e.g. `dark_mode`)
8. Enable or disable it using the toggle button
9. Go back and click **User Portal**
10. Select the organisation and type `dark_mode`
11. Click Check — you'll see if it's enabled or disabled

---

## Project Structure

```
feature-flag-system/
│
├── index.html                  ← Main landing page (start here)
│
├── backend/
│   ├── server.js               ← All API routes and server logic
│   ├── database.js             ← Database setup and table creation
│   ├── auth.js                 ← Login tokens and authentication
│   └── package.json            ← Project dependencies
│
└── frontend/
    ├── super-admin/
    │   └── index.html          ← Super Admin portal
    ├── admin/
    │   └── index.html          ← Organisation Admin portal
    └── user/
        └── index.html          ← End User portal
```

---

## API Endpoints

| Method | Endpoint | Who Uses It | What It Does |
|--------|----------|-------------|--------------|
| POST | /super-admin/login | Super Admin | Login |
| GET | /organisations | Super Admin | List all organisations |
| POST | /organisations | Super Admin | Create an organisation |
| GET | /organisations-public | Anyone | List orgs for dropdowns |
| POST | /admin/signup | Admin | Create admin account |
| POST | /admin/login | Admin | Login |
| GET | /flags | Admin | Get all flags for their org |
| POST | /flags | Admin | Create a new flag |
| PUT | /flags/:id | Admin | Enable or disable a flag |
| PUT | /flags/:id/key | Admin | Edit a flag name |
| DELETE | /flags/:id | Admin | Delete a flag |
| GET | /check-flag?key=x&org_id=1 | End User | Check if flag is on or off |

---

## Database Structure

The system uses SQLite and has 4 tables:

- **organisations** — stores company names
- **roles** — stores user roles (super_admin, admin, end_user)
- **users** — stores admin accounts linked to a role and organisation
- **feature_flags** — stores flags linked to an organisation

---

## Tech Stack

| Part | Technology |
|------|------------|
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| Authentication | Custom JWT + bcrypt (no third-party auth) |
| Frontend | Plain HTML + CSS + JavaScript |

---

## Security

- Passwords are hashed using bcrypt before storing
- JWT tokens are used for session management
- Each admin can only see and manage their own organisation's flags
- Role-based access control prevents unauthorised actions

---

## Notes for Reviewers

- No third-party authentication services were used (no Auth0, Firebase, etc.)
- Feature flags are fully scoped to each organisation
- The roles system uses a proper roles table with foreign keys
- All three frontend apps are plain HTML with no frameworks
