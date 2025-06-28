# SpookySpot - Technical Interview Cheat Sheet

## 🏗️ **ARCHITECTURE OVERVIEW**
**Project Type**: Full-stack Airbnb clone built during App Academy bootcamp  
**Deployment**: Docker containers on production server  
**Pattern**: RESTful API with MVC architecture  

---

## 📚 **TECH STACK & INTEGRATIONS**

### **Backend Stack**
- **Node.js + Express.js**: Web framework for API server
- **PostgreSQL**: Primary database with Sequelize ORM
- **Docker**: Containerization for deployment
- **MinIO**: Object storage for image uploads
- **JWT**: Authentication tokens stored in httpOnly cookies
- **bcrypt.js**: Password hashing

### **Frontend Stack**  
- **React 18**: Component-based UI library
- **Vite**: Modern build tool and dev server
- **Redux + Redux Thunk**: State management with async middleware
- **React Router Dom**: Client-side routing
- **CSS Modules**: Scoped styling

### **Security & Middleware**
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **CSURF**: CSRF protection via tokens
- **express-validator**: Input validation
- **express-async-errors**: Error handling

---

## 🔗 **HOW COMPONENTS INTEGRATE**

### **Authentication Flow**
1. **Frontend**: User submits login form → Redux action
2. **API Call**: Fetch to `/api/session` with credentials  
3. **Backend**: Express validates → bcrypt checks password → JWT signed
4. **Response**: JWT stored in httpOnly cookie + user data to Redux store
5. **Persistence**: `restoreUser` middleware validates JWT on each request

### **Data Flow Example (Spots)**
1. **Component**: `AllSpots.jsx` mounts → useEffect triggers Redux action
2. **Redux**: `getAllSpots()` thunk → fetch to `/api/spots`  
3. **Backend**: Express route → Sequelize query → PostgreSQL
4. **Response**: JSON data → Redux store → Component re-renders

### **Image Upload Flow**
1. **Frontend**: User selects image → FormData with file
2. **Backend**: Multer middleware handles multipart/form-data  
3. **Storage**: MinIO object storage saves file
4. **Database**: Image URL stored in SpotImages/ReviewImages table

### **Docker Integration**
- **3 Services**: Frontend (Nginx), Backend (Node), Database (PostgreSQL)
- **Health Checks**: Each service monitors dependencies
- **Networking**: Shared Docker network for inter-service communication
- **Volumes**: Persistent data storage for PostgreSQL

---

## 💾 **DATABASE SCHEMA & RELATIONSHIPS**

### **Core Models**
```
Users (1) ←→ (Many) Spots (ownerId)
Users (1) ←→ (Many) Reviews  
Users (1) ←→ (Many) Bookings

Spots (1) ←→ (Many) Reviews
Spots (1) ←→ (Many) Bookings  
Spots (1) ←→ (Many) SpotImages

Reviews (1) ←→ (Many) ReviewImages
```

### **Key Constraints**
- **Cascade Deletes**: Deleting a spot removes all its reviews/bookings/images
- **Unique Constraints**: Address must be unique per spot
- **Validations**: Star ratings 1-5, email format, username not email

---

## 🎯 **VP-LEVEL INTERVIEW Q&A**

### **JWT Implementation**
**Q: "How does JWT authentication work in your app?"**  
**A**: "I implemented stateless authentication using JWT tokens. When users log in, the server signs a JWT containing safe user data (id, email, username) with a secret key and 1-week expiration. The token is stored in an httpOnly cookie for security - it prevents XSS attacks since JavaScript can't access it. On each request, my `restoreUser` middleware extracts the token, verifies it against the secret, and attaches the user to the request object. If the token is invalid or expired, I clear the cookie and require re-authentication."

**Q: "Why JWT over sessions?"**  
**A**: "JWT is stateless - I don't need to store session data server-side, which simplifies scaling. The token itself contains the user data, so I can verify identity without database lookups on every request. However, I still query the database to get fresh user data to handle cases where users might be deleted."

### **Database Design**
**Q: "Walk me through your database relationships."**  
**A**: "I designed a normalized schema with 6 main entities. Users are the central entity - they own spots, write reviews, and make bookings. I used foreign keys with cascade deletes so removing a spot automatically cleans up its associated reviews, bookings, and images. I chose PostgreSQL for ACID compliance and robust relationship handling. Sequelize ORM handles the JavaScript-to-SQL translation and provides migration management."

**Q: "How do you handle data consistency?"**  
**A**: "I rely on PostgreSQL's ACID properties for data integrity. Foreign key constraints prevent orphaned records. I use Sequelize transactions for multi-table operations. The unique constraint on spot addresses prevents duplicates. Model validations ensure data quality before hitting the database."

### **State Management**
**Q: "Why Redux for state management?"**  
**A**: "Redux provides predictable state management crucial for this app's complexity. I have user session data, spot listings, and reviews that multiple components need to access. Redux's single source of truth prevents sync issues. I use Redux Thunk for async API calls, keeping components clean by moving side effects to action creators. The DevTools integration was invaluable for debugging during development."

**Q: "How do you handle async operations?"**  
**A**: "I use Redux Thunk middleware to handle async actions. For example, when fetching spots, the thunk dispatches a loading action, makes the API call, then dispatches success/error actions based on the response. This pattern keeps async logic out of components and makes it reusable across the app."

### **Security Implementation**  
**Q: "What security measures did you implement?"**  
**A**: "Multiple layers: Helmet sets security headers like XSS protection and content sniffing prevention. CORS restricts which origins can access my API. CSRF tokens prevent cross-site request forgery - I validate tokens on state-changing operations. Passwords are hashed with bcrypt using salt rounds. JWT tokens are httpOnly to prevent XSS. Input validation with express-validator sanitizes user data."

**Q: "How do you prevent SQL injection?"**  
**A**: "Sequelize ORM automatically parameterizes queries, so user input is escaped. I also validate and sanitize input with express-validator before it reaches the database layer."

### **Performance & Scaling**
**Q: "How would you scale this application?"**  
**A**: "Several approaches: Database scaling with read replicas for spot searches, Redis caching for frequently accessed data like popular spots, CDN for static assets and images, horizontal scaling of the Node.js backend with load balancing. I'd also implement database indexing on commonly queried fields like city/state for spot searches."

**Q: "What performance optimizations did you implement?"**  
**A**: "Frontend: React.memo for expensive components, lazy loading of routes, image optimization. Backend: Database indexing on foreign keys, eager loading with Sequelize includes to avoid N+1 queries, compression middleware for responses."

### **Error Handling**
**Q: "How do you handle errors across the stack?"**  
**A**: "Three-layer approach: Frontend validates user input before API calls, backend validates with express-validator and returns structured error responses, database constraints provide final validation. I use express-async-errors to catch async route errors and format them consistently. React error boundaries prevent crashes and show user-friendly messages."

### **Docker & Deployment**
**Q: "Why containerize this application?"**  
**A**: "Docker ensures consistency across development and production environments. My docker-compose orchestrates three services with proper dependency management - the database starts first, backend waits for database health checks, frontend depends on backend. Health checks ensure services are truly ready before dependent services start. Volume mounting persists PostgreSQL data across container restarts."

**Q: "How do you handle environment differences?"**  
**A**: "Environment-specific configuration through Docker environment variables and NODE_ENV checks. Different CORS origins, cookie security settings, and logging levels for development vs production. The same Docker images work everywhere with different environment variables."

### **API Design**
**Q: "How did you design your RESTful API?"**  
**A**: "I followed REST conventions: GET /api/spots for listings, POST for creation, PUT for updates, DELETE for removal. Nested resources like /api/spots/:id/reviews for spot-specific reviews. Consistent error response format with status codes. Used HTTP status codes appropriately - 401 for auth required, 403 for forbidden, 404 for not found."

### **Testing Strategy**  
**Q: "How would you test this application?"**  
**A**: "Multi-layer testing: Unit tests for utility functions and Redux actions, integration tests for API endpoints using supertest, component testing with React Testing Library, end-to-end tests with Cypress for critical user flows. Database seeding for consistent test data. Separate test database to avoid affecting development data."

---

## 🚀 **KEY TALKING POINTS**

### **Technical Decisions**
- **PostgreSQL over NoSQL**: Needed relational data with foreign keys
- **JWT over sessions**: Stateless authentication for better scalability  
- **Redux over Context**: Complex state management across many components
- **Vite over Create React App**: Faster builds and modern tooling
- **CSS Modules over styled-components**: Scoped styling without runtime overhead

### **Challenges Overcome**
- **CORS & CSRF**: Configured for cross-origin requests while maintaining security
- **Image Uploads**: Integrated MinIO object storage with multipart form handling  
- **Database Associations**: Complex Sequelize relationships with proper cascade deletes
- **Docker Orchestration**: Service dependencies and health checks

### **Production Considerations**
- **Security**: httpOnly cookies, CSRF protection, input validation, password hashing
- **Performance**: Eager loading, database indexing, image optimization
- **Monitoring**: Structured error responses, health checks, logging
- **Scalability**: Stateless JWT, containerized services, environment configuration

---

## 💡 **BONUS TECHNICAL INSIGHTS**

**Sequelize ORM Benefits**: "Handles database differences, provides migration system, prevents SQL injection, offers eager loading to solve N+1 problems."

**React Component Architecture**: "Followed container/presentation pattern - smart components handle logic, dumb components handle rendering. Custom hooks for reusable state logic."

**Redux Pattern**: "Actions describe what happened, reducers specify how state changes, selectors compute derived state. Kept reducers pure and side effects in thunks."

**Express Middleware Chain**: "Structured middleware pipeline - logging, parsing, CORS, CSRF, authentication, routes, error handling. Order matters for security."