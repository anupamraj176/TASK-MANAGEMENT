// Add these routes to your existing routes/index.jsx (or App.jsx)
// This is a SNIPPET — merge with your existing route config

import TasksPage from '../pages/TasksPage';
import TaskDetailPage from '../pages/TaskDetailPage';

// Inside your <Routes> block, within your protected route wrapper:
//
// <Route path="/tasks" element={<TasksPage />} />
// <Route path="/tasks/:id" element={<TaskDetailPage />} />
//
// Example if using a ProtectedRoute wrapper:
//
// <Route element={<ProtectedRoute />}>
//   <Route path="/tasks" element={<TasksPage />} />
//   <Route path="/tasks/:id" element={<TaskDetailPage />} />
// </Route>
