
# 🏙️ Cityzen – Public Issue Reporting and Management System

A full-stack web application that allows citizens to report civic issues (such as road damage, streetlight outages, or garbage problems) and track their resolution status. Admins can manage issues and assign them to available workers, while workers can update the progress and notify users upon resolution.

---

## 🚀 Features

### 👤 User
- **Register with OTP Verification** via email.
- **Secure Login** and **Forgot Password** with OTP-based reset.
- **Raise Civic Issues** by selecting:
  - Issue type: Road, Light, Garbage, etc.
  - Area/Region under the jurisdiction.
- **Track Submitted Issues** via the *My Issues* section.
- Receive **email notifications** about issue status updates.

### 🛠️ Admin
- **View and manage**:
  - All registered **users** and **workers**.
  - All reported **issues**, categorized as:
    - **Assigned**
    - **Not Assigned**
- **Assign issues** to workers based on availability and location.
- **Add/Remove workers** and manage their roles.

### 👷 Worker
- **Receive assignment emails** when a new issue is assigned.
- **View assigned issues** and update their status.
- **Send issue completion status**, which notifies the user via email.

---

## 🧰 Tech Stack

| Frontend | Backend | Database | Email |
|----------|---------|----------|-------|
| React.js | Node.js + Express.js | MongoDB | Nodemailer |

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vishnuboligili/Cityzen
