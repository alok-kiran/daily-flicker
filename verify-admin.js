// Verify admin user exists
use('daily_flicker');

console.log("=== ADMIN USER VERIFICATION ===");

// Find the admin user
const adminUser = db.User.findOne({email: "alokkiran777@gmail.com"});

if (adminUser) {
  console.log("✅ Admin user found!");
  console.log("📧 Email:", adminUser.email);
  console.log("👤 Name:", adminUser.name);
  console.log("🔑 Role:", adminUser.role);
  console.log("📅 Created:", adminUser.createdAt);
  console.log("🆔 User ID:", adminUser._id);
  
  if (adminUser.role === "admin") {
    console.log("🎉 User has ADMIN privileges!");
  } else {
    console.log("⚠️  User does NOT have admin privileges!");
  }
} else {
  console.log("❌ Admin user NOT found!");
}

// Show all users for verification
console.log("\n=== ALL USERS IN DATABASE ===");
db.User.find({}).forEach(user => {
  console.log(`- ${user.email} (${user.role})`);
});
