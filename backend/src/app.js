const express = require('express');
const cors = require('cors');
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/user/user.routes');
const recordRoutes = require('./modules/record/record.routes');
const dashboardRoutes = require('./modules/dashboard/dashboard.routes');
const departmentRoutes = require('./modules/department/department.routes');
const categoryRoutes = require('./modules/category/category.routes');
const budgetRoutes = require('./modules/budget/budget.routes');

const app = express();

app.use(cors({
  origin: [
    'https://fintrackhqsys.vercel.app',
    `http://localhost:${process.env.PORT || 8080}`,
    `http://localhost:${process.env.PORT || 3001}`
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/budgets', budgetRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Basic Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
