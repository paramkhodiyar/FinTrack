const prisma = require('../src/prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  console.log('Clearing existing data...');
  // Delete in reverse relational order
  await prisma.record.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.department.deleteMany();

  console.log('Seeding robust historical data...');

  // 1. Departments
  const deptEngineering = await prisma.department.create({ data: { name: 'Engineering' } });
  const deptMarketing = await prisma.department.create({ data: { name: 'Marketing' } });
  const deptSales = await prisma.department.create({ data: { name: 'Sales' } });
  const departments = [deptEngineering, deptMarketing, deptSales];

  // 2. Categories
  const catSoftware = await prisma.category.create({ data: { name: 'Software Services', nature: 'EXPENSE' } });
  const catHardware = await prisma.category.create({ data: { name: 'Hardware', nature: 'EXPENSE', parentId: catSoftware.id } });
  const catMarketing = await prisma.category.create({ data: { name: 'Ad Campaigns', nature: 'EXPENSE' } });
  const catSales = await prisma.category.create({ data: { name: 'Product Sales', nature: 'INCOME' } });
  const catConsulting = await prisma.category.create({ data: { name: 'Consulting', nature: 'INCOME' } });
  const categories = [catSoftware, catHardware, catMarketing, catSales, catConsulting];

  // 3. Budgets
  await prisma.budget.create({
    data: {
      amount: 50000,
      period: 'MONTHLY',
      startDate: new Date('2026-03-01T00:00:00Z'),
      endDate: new Date('2026-03-31T23:59:59Z'),
      departmentId: deptEngineering.id,
    }
  });

  // 4. Users
  const password = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@system.com', password, role: 'ADMIN' },
  });
  
  const engineerUser = await prisma.user.create({
    data: { name: 'Engineering Recorder', email: 'recorder@eng.com', password, role: 'ENTRY_RECORDER', departmentId: deptEngineering.id },
  });

  const analystUser = await prisma.user.create({
    data: { name: 'System Analyst', email: 'analyst@system.com', password, role: 'ANALYST' },
  });

  const standardUser = await prisma.user.create({
    data: { name: 'Standard User', email: 'user@system.com', password, role: 'USER', departmentId: deptSales.id },
  });

  // 5. Generate 60 days of Records!
  const today = new Date();
  
  for (let i = 0; i < 60; i++) {
    // Generate an offset date going backwards
    const recordDate = new Date(today);
    recordDate.setDate(today.getDate() - i);

    // Randomize 1 to 4 records per day
    const recordsPerDay = Math.floor(Math.random() * 4) + 1;

    for (let j = 0; j < recordsPerDay; j++) {
      // Pick random category and department
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomDept = departments[Math.floor(Math.random() * departments.length)];
      
      // Randomize amount between $100 and $5000
      const amount = Math.floor(Math.random() * 4900) + 100;

      await prisma.record.create({
        data: {
          amount,
          nature: randomCategory.nature,
          date: recordDate,
          status: 'APPROVED', // Keep approved so it shows in charts
          notes: `Simulated historic entry for ${recordDate.toISOString().substring(0,10)}`,
          categoryId: randomCategory.id,
          departmentId: randomDept.id,
          createdById: admin.id,
        }
      });
    }
  }

  console.log('Seeding finished successfully with 60 days of records.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
