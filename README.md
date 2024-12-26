# TO RUN THE PROEJCT

1. Clone the project
2. Install docker on your system if not already
3. Run the following command on the root of the project dir:

- - docker-compose up (to start a new container)
- - docker ps (to check the running containers)
- - docker logs -f <container-id> (to check the container logs)
- - docker exec -it <container-id> /bin/bash (to run the container terminal)

4. To make changes and rebuild

- - docker-compose down (to stop containers)
- - docker-compose p --build (to restart and update the changes in container)

# Env file for Backend

- DB_NAME=esport
- DB_USER=esport
- DB_PASSWORD=esport
- DB_HOST=esport_database //localhost
- DB_PORT=5432

- SECRET_KEY = your-django-secret-key
- ALLOWED_HOSTS=127.0.0.1,localhost,localhost:3000,127.0.0.1:8000
- CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://192.168.101.3:3000

- EMAIL_HOST=smtp.gmail.com
- EMAIL_PORT=587
- EMAIL_USE_TLS=True
- EMAIL_HOST_USER=youremail@gmail.com
- EMAIL_HOST_PASSWORD=yourpasskey
- JWT_SECRET=secretkey
- TOKEN_KEY=secretkey

# Env file for Frontend

- NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

# Project Description

This project is a full-stack e-commerce web application with a built-in wallet functionality, implemented with a modern technology stack for scalability, security, and performance.

<img width="1353" alt="Screenshot 2024-12-26 at 7 53 17 PM" src="https://github.com/user-attachments/assets/0ffa9f17-cc3d-4d85-bcd3-ac3d73904d3d" />

## Frontend: Next.js (with TypeScript)

### 1.Framework:

- Built using Next.js, leveraging its App Router for seamless routing and server-side rendering (SSR) capabilities.
- TypeScript ensures strong typing for better maintainability.

### 2.Styling:

- Tailwind CSS: For a responsive, customizable design.

### Key Features:

- Progressive Web App (PWA): Enables offline capabilities, push notifications, and app-like behavior.
- Authentication: JWT tokens securely stored for user authentication.
- Secure API Integration: Axios is used for handling API requests with React Hook Form for managing forms.
- Dynamic Product Display: Fetches and displays categories, products, banners, and details dynamically from the backend.
- Wallet Usage: Frontend integrates with wallet APIs for recharges, deductions, and real-time balance updates.
- Admin Panel: Provides admin control for managing products, categories, and banners.

## Backend: Python Django (DRF)

## 1.Framework:

- Built with Django Rest Framework (DRF), adhering to RESTful principles for API design.
- Includes JWT-based Authentication for secure communication between the frontend and backend.

## 2.Features:

- User Management: Handles registration, email verification, login/logout, password reset, and account deletion.
- Wallet System:
- Users have a secure wallet to store e-money.
- Recharge requests are sent to admins for approval.
- Purchases deduct wallet balance and generate transaction records.
- Products and Categories:
- Admins manage categories and products with detailed product data like price, images, HTML descriptions, FAQs, and gift vouchers.
- Users can browse products by category and view detailed product information.
- Secure product purchase workflow integrated with wallet transactions.
- Banners: Displays promotional banners for users, managed by admins.
- Order History: Logs all transactions for users, maintaining transparency.
- Gifts: Supports products with vouchers, emailed to users securely after purchase.
- Admin Features:
- Manage categories, products, banners, and gifts.
- Approve/reject wallet recharge requests.
- Update product-specific gift lists.

## Database: PostgreSQL

## 1.RDBMS:

- PostgreSQL is used for reliable, high-performance data storage.
- Supports advanced features like JSON fields for product FAQs and transactional integrity for wallet operations.

## 2.Schema Highlights:

- Users and Wallets: Linked for personalized wallet management.
- Products and Categories: Optimized relational structure for fast queries.
- Orders: Tracks product purchases with voucher codes and wallet balance updates.
- Gifts: Safely stores and manages gift voucher codes for applicable products.

This architecture ensures scalability, security, and a seamless user experience, making the project ideal for modern e-commerce solutions.
