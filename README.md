CiviQ --- Civil Engineering Estimation & BOQ Generator
CiviQ (Civil + Quantity) is a web application designed to make civil
engineering quantity estimation and Bill of Quantities (BOQ) preparation
more organized and accessible. It was inspired by repetitive estimation
workflows experienced during our Civil Engineering studies.
The core concept was developed together with Dubbakula Nithin Kumar.
Nithin represented the concept through a physical model, while this
project focuses on bringing the concept into a digital application.
Overview
CiviQ helps users organize construction estimation work by project,
calculate quantities for common work items, apply rates, and generate a
BOQ report.
The interface is designed to be responsive, so users can access it
on desktop computers, tablets, and mobile phones.
Features
- Project management --- create, view, update, and delete
  construction estimation projects.
- Quantity estimation --- enter dimensions for supported
  measurement types.
- Multiple units --- supports m³, m², m, kg, nos, and
  ls.
- Automatic calculations --- calculate quantities from dimensions
  where applicable and calculate item amounts from quantity and rate.
- Work categories --- organize work items by category.
- BOQ generation --- organize estimation items into a Bill of
  Quantities with totals.
- PDF export --- generate and download BOQ reports as PDF files.
- Responsive interface --- use the application on desktop and
  mobile devices.
- Persistent project data --- the backend stores project and
  estimation data in MongoDB.
CiviQ is an estimation aid. Verify project inputs, rates, assumptions,
and generated quantities before using them for construction,
procurement, or contractual purposes.

Technology Stack
Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Lucide React
- React Context API
Backend
- Node.js
- Express
- MongoDB
- Mongoose
Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
Add the confirmed URLs here:
- Live application: ADD_YOUR_VERCEL_URL
- GitHub repository: ADD_YOUR_GITHUB_REPOSITORY_URL
- Backend health endpoint: ADD_YOUR_RENDER_URL/api/health
Supported Measurement Units
  Unit    Typical use          Quantity method
  m³    Volume-based work    Length × Width × Depth
  m²    Area-based work      Length × Width
  m     Linear work          Length
  kg    Weight-based items   Manual quantity
  nos   Countable items      Manual quantity
  ls    Lump-sum items       Manual quantity
Calculated quantities are rounded to three decimal places in the current
calculation workflow. Amounts are calculated as:
Amount = Quantity × Rate
The dimensions and calculation method should match the specific work
item and applicable engineering practice.
Work Categories
- Earthwork
- PCC
- RCC
- Reinforcement
- Brickwork
- Plastering
- Flooring
- Painting
- Doors & Windows
- Plumbing
- Electrical
- Miscellaneous
Getting Started
These instructions describe a typical local development setup.
Environment variable names must match those read by your application
code.
Prerequisites
- Node.js and npm
- Git
- A MongoDB database, such as MongoDB Atlas
1. Clone the repository
git clone ADD_YOUR_GITHUB_REPOSITORY_URL
cd CiviQ
Replace the placeholder with your actual repository URL.
2. Set up the backend
cd backend
npm install
Create a local .env file in the backend directory using the variable
names expected by your database configuration. For example, if your code
reads MONGO_URI:
MONGO_URI=your_mongodb_connection_string
PORT=5000
Do not commit .env files or expose database credentials.
Start the backend using the script defined in backend/package.json. If
it has a start script:
npm start
The health endpoint should be available locally at
http://localhost:5000/api/health.
3. Set up the frontend
Open a second terminal:
cd frontend
npm install
Configure the frontend API URL using the variable expected by
src/services/api.js. For example, if the code uses VITE_API_URL and
expects the backend root URL:
VITE_API_URL=http://localhost:5000
If your API service expects /api in the base URL, include it. Check
src/services/api.js before setting this value.
Start the development server:
npm run dev
Vite prints the local development URL in the terminal, commonly
http://localhost:5173.
4. Build the frontend
From the frontend directory:
npm run build
The production build is normally generated in the dist directory.
API Overview
The backend provides project and estimation endpoints. Confirm exact
routes in the current backend route files before integrating another
client.
  Method                  Route                                    Purpose
  GET                   /api/health                            Check API status
  GET                   /api/projects                          List projects
  POST                  /api/projects                          Create a project
  GET                   /api/projects/:projectId               Fetch a project
  PUT                   /api/projects/:projectId               Update a project
  DELETE                /api/projects/:projectId               Delete a project
  GET                   /api/projects/:projectId/estimations   List a project's
                                                                   estimation items
  POST                  /api/projects/:projectId/estimations   Add an estimation item
  PUT                   /api/estimations/:id                   Update an estimation
                                                                   item
  DELETE                /api/estimations/:id                   Delete an estimation
                                                               item
These routes are a documentation guide; verify them against the deployed
API before relying on them.
Deployment
The intended deployment arrangement is:
- Vercel for the React + Vite frontend.
- Render for the Node.js/Express API.
- MongoDB Atlas for database hosting.
For deployment:
1. Set the backend database connection string as a secret environment
   variable on Render.
2. Configure the backend to allow requests from the deployed frontend
   origin.
3. Set the frontend API URL environment variable in Vercel to the
   deployed Render service URL.
4. Rebuild/redeploy the frontend after changing Vite environment
   variables.
5. Test project creation, estimation calculations, BOQ generation, and
   PDF downloads on the live application.
Never place database credentials or other secrets in frontend
environment variables or commit them to GitHub.
Potential Future Improvements
- Rate analysis with material, labour, and equipment breakdowns.
- Reusable estimation templates.
- Excel import and export.
- Custom rate libraries.
- Estimation revision history.
- Team collaboration and project sharing.
- Additional customizable report formats.
- More standard work-item templates and validation.
These are potential future enhancements, not a claim that they are
already implemented.
Contributing & Feedback
CiviQ is a learning-oriented project, and feedback from Civil
Engineering students and practitioners is welcome.
If you have suggestions, identify an issue, or would like to discuss
potential features, contact:
Email: erikillashish11@gmail.com
Please include a clear description of the suggested improvement or
issue.
Acknowledgements
The core idea behind CiviQ was developed jointly with Dubbakula Nithin
Kumar. The concept was represented through a physical model, and this
project explores its digital implementation.
Thank you to the friends, juniors, seniors, and fellow Civil Engineering
students whose experiences with estimation workflows helped inspire the
idea.
License
No license has been specified yet. If you want others to reuse, modify,
or distribute this project, choose and add an appropriate open-source
license before describing the project as open source.
