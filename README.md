# FinTrack: Financial Record Manager 📊💰

A comprehensive, role-based financial management dashboard and analytics backend designed to centralize departmental budgets, stream income/expense pipelines, and render analytical KPIs visually. 

---

## 🎯 Problem Statement
In scaling organizations, financial visibility is often fragmented across departments. Sales tracks income, Engineering scopes platform budgets, and Marketing expends on advertising—often operating in silos utilizing disconnected spreadsheets. 

**FinTrack** was engineered to solve this logistical nightmare by offering a unified, strict Role-Based Access Control (RBAC) platform. It allows discrete entry recorders to log transactions for their specific departments, requires administrative approval for financial mutations, and grants analysts a birds-eye panoramic view of organizational fiscal health with smooth, time-filtered charting features.

---

## ✨ Features
*   **Role-Based Access Control (RBAC):** Tiered architecture natively segregates `ADMIN`, `ANALYST`, `ENTRY_RECORDER`, and `USER` authorities.
*   **Approval Pipeline:** Expenses logged by Entry Recorders are scoped as `PENDING` until an Admin verifies and sets them to `APPROVED`.
*   **Analytics Engine:** Fluid, interactive representations of expenses utilizing **Chart.js**. Capable of clustering data natively into `Today`, `Last Week`, `Last Month`, and `All Time` aggregations.
*   **Department Segregation:** Granular filtering to ensure standard users only access or view financial footprints correlated directly to their authorized Department.
*   **Modern Frontend Stack:** Engineered using Next.js 16 (App Router), Tailwind CSS, Zustand state persistence, and Lucide React iconography.
*   **Robust Backend Stack:** Constructed atop Node.js/Express, utilizing Prisma ORM interfacing directly with a PostgreSQL database.

---

## 🚀 Quick Start (Localhost)

### 1. Backend Server
Navigate to the backend directory, install packages, and boot the server.
```bash
cd backend
npm install
npm run dev
```
> The backend REST API boots on `https://fintrack-iire.onrender.com/api` (Production), or `http://localhost:8080/api` locally.

### 2. Frontend Interface
Navigate to the frontend directory, install dependencies, and launch the dev server.
```bash
cd frontend
npm install
npm run dev
```
> The Next.js dashboard boots on `https://fintrackhqsys.vercel.app` (Production), or `http://localhost:3000` locally.

---

## 📡 API Reference

### 🔐 Authentication
| Endpoint | Method | Role Required | Description |
| :--- | :---: | :---: | :--- |
| `/api/auth/register` | `POST` | *Public* | Registers a new internal user |
| `/api/auth/login` | `POST` | *Public* | Authenticates and returns JWT |

### 📊 Dashboard Metrics
| Endpoint | Method | Role Required | Description |
| :--- | :---: | :---: | :--- |
| `/api/dashboard/summary` | `GET` | *Authenticated* | Retrieves net income, expense, and balance |
| `/api/dashboard/categories` | `GET` | *Authenticated* | Expenses grouped by categorization |
| `/api/dashboard/departments`| `GET` | `ADMIN`, `ANALYST`| Expenditures isolated by organization department |
| `/api/dashboard/trends` | `GET` | *Authenticated* | Temporal dataset for chart visualization |
| `/api/dashboard/activity` | `GET` | *Authenticated* | Recent raw transactional events log |
*(All dashboard endpoints accept a `?period=` modifier: `TODAY`, `LAST_WEEK`, `LAST_MONTH`, `ALL`)*

### 📝 Records Pipeline
| Endpoint | Method | Role Required | Description |
| :--- | :---: | :---: | :--- |
| `/api/records/` | `GET` | `ADMIN`, `ANALYST`, `USER`, `RECORDER`| Fetches paginated transactional records |
| `/api/records/` | `POST` | `ADMIN`, `ENTRY_RECORDER`| Creates a new financial record |
| `/api/records/:id/approve` | `PATCH` | `ADMIN` | Modifies status to `APPROVED` or `REJECTED` |
| `/api/records/:id` | `DELETE`|  `ADMIN` | Permanently deletes an erroneous entry |

### 🗂️ Categories & Departments
| Endpoint | Method | Role Required | Description |
| :--- | :---: | :---: | :--- |
| `/api/categories/` | `GET` | *Authenticated* | Lists available expense/income categories |
| `/api/categories/` | `POST` | `ADMIN` | Appends a new global category |
| `/api/departments/` | `GET` | *Authenticated* | Lists valid organizational divisions |
| `/api/departments/` | `POST` | `ADMIN` | Registers a new company division |

### 💼 Budgets
| Endpoint | Method | Role Required | Description |
| :--- | :---: | :---: | :--- |
| `/api/budgets/` | `GET` | *Authenticated* | Views department budget allocations |
| `/api/budgets/` | `POST` | `ADMIN` | Disburses or modifies department budgets |

### 👥 User Administration
| Endpoint | Method | Role Required | Description |
| :--- | :---: | :---: | :--- |
| `/api/users/` | `GET` | `ADMIN` | Fetches directory of all personnel |
| `/api/users/` | `POST` | `ADMIN` | Mutates permissions or seeds users |
| `/api/users/:id/status`| `PATCH` | `ADMIN` | Toggles Active/Deactivated employment status |

---

## 🙋‍♂️ About Me
Thank you for checking out FinTrack! I designed this repository aiming to merge clean UX/UI aesthetic practices with robust enterprise-level logical routing pipelines. 

**Param Khodiyar** 
*   📧 **Email:** [paramkhodiyar1008@gmail.com]
*   **Portfolio:** [paramkhodiyar.com](https://paramkhodiyar.vercel.app)
*   🐙 **GitHub:** [github.com/paramkhodiyar](https://github.com/paramkhodiyar)
*   👔 **LinkedIn:** [linkedin.com/in/paramkhodiyar](https://www.linkedin.com/in/paramkhodiyar/)
