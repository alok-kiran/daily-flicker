// MongoDB script to create admin user
use('daily_flicker');

// Create admin user
db.User.insertOne({
  _id: new ObjectId(),
  name: "Alok Kiran",
  email: "alokkiran777@gmail.com", 
  emailVerified: new Date(),
  image: null,
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
});

console.log("Admin user created successfully!");

// Verify the user was created
const adminUser = db.User.findOne({email: "alokkiran777@gmail.com"});
console.log("Admin user:", adminUser);
