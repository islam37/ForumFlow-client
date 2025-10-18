# ForumFlow

**ForumFlow** is a full-stack MERN forum application where users can create posts, comment, vote, and interact with a community. It includes features like user authentication, membership-based privileges, admin management, and a responsive design.

---

## 🌟 Features

- User Authentication (Email & Social Login)
- Role-based Access (User / Admin)
- Home Page with:
  - Post feed (newest first)
  - Search by tags
  - Announcement section with count
  - Sort by popularity
  - Pagination (5 posts per page)
- Post Details Page:
  - Comments, Upvote/Downvote
  - Share posts via social media
- User Dashboard:
  - Profile with badges
  - Add Posts (max 5 for normal users)
  - Manage My Posts
- Membership Page:
  - Users can become members to unlock perks (Gold Badge)
- Admin Dashboard:
  - Manage users, posts, reported comments
  - Make announcements
  - Add tags
  - Analytics (charts for posts, comments, users)
- Secure Firebase & MongoDB credentials via environment variables
- Fully responsive on mobile, tablet, and desktop
- TanStack Query for all GET requests

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS, React Router, React Hook Form, React-Select, React-Share  
- **Backend:** Node.js, Express.js, MongoDB, Firebase Admin  
- **State Management / Data Fetching:** TanStack Query  
- **Authentication:** JWT & Firebase  
- **Deployment:** Netlify (Frontend), Render/Heroku (Backend)  

---

## 🚀 Installation

1. Clone the repo:

```bash
git clone https://github.com/<your-username>/ForumFlow.git
