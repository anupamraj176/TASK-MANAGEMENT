const mongoose = require('mongoose');

async function checkDB() {
  try {
    await mongoose.connect('mongodb+srv://anupamr797:Rasmalaiwala%40@cluster0.jgebbdd.mongodb.net/task_management');
    console.log('Connected to DB');

    const Task = mongoose.model('Task', new mongoose.Schema({}, { strict: false }));
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

    const tasks = await Task.find({}).lean();
    console.log('--- TASKS ---');
    for (const t of tasks) {
      console.log(`Task: ${t.title}`);
      console.log(`  AssignedTo: ${t.assignedTo}`);
      console.log(`  CreatedBy:  ${t.createdBy}`);
      console.log(`  Status:     ${t.status}`);
      console.log(`  Docs count: ${t.attachedDocuments?.length || 0}`);
    }

    const users = await User.find({}).lean();
    console.log('\n--- USERS ---');
    for (const u of users) {
      console.log(`User: ${u.email} | Role: ${u.role} | ID: ${u._id}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDB();
