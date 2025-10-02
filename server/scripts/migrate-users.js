import mongoose from "mongoose";
import User from "../models/user.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Migration script to help migrate existing users to Clerk
 * This script will:
 * 1. List all existing users
 * 2. Generate a mapping file for manual Clerk user creation
 * 3. Optionally create placeholder Clerk users (requires manual intervention)
 */

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is not set in environment variables");
  process.exit(1);
}

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

async function listExistingUsers() {
  try {
    // Get all users (including those with passwords)
    const users = await User.find({}).select("email role skills createdAt");
    
    console.log(`\n📋 Found ${users.length} existing users:`);
    console.log("=" * 50);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Skills: ${user.skills.join(", ") || "None"}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log("-" * 30);
    });
    
    return users;
  } catch (error) {
    console.error("❌ Error listing users:", error);
    throw error;
  }
}

async function generateMigrationMapping(users) {
  const mapping = {
    migration_date: new Date().toISOString(),
    total_users: users.length,
    users: users.map(user => ({
      old_email: user.email,
      old_role: user.role,
      old_skills: user.skills,
      old_created_at: user.createdAt,
      clerk_user_id: null, // To be filled manually
      migration_status: "pending"
    }))
  };
  
  // Write mapping to file
  const fs = await import('fs');
  const path = await import('path');
  
  const mappingFile = path.join(process.cwd(), 'user-migration-mapping.json');
  fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));
  
  console.log(`\n📄 Migration mapping saved to: ${mappingFile}`);
  console.log("📝 Next steps:");
  console.log("1. Create users in Clerk Dashboard");
  console.log("2. Update the mapping file with Clerk user IDs");
  console.log("3. Run the migration script with --apply flag");
  
  return mapping;
}

async function applyMigration(mappingFile) {
  try {
    const fs = await import('fs');
    const mapping = JSON.parse(fs.readFileSync(mappingFile, 'utf8'));
    
    console.log(`\n🔄 Applying migration for ${mapping.users.length} users...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const userMapping of mapping.users) {
      if (!userMapping.clerk_user_id) {
        console.log(`⚠️  Skipping ${userMapping.old_email} - no Clerk user ID`);
        errorCount++;
        continue;
      }
      
      try {
        // Update user with Clerk user ID
        await User.updateOne(
          { email: userMapping.old_email },
          {
            $set: {
              clerkUserId: userMapping.clerk_user_id,
              lastSyncedAt: new Date(),
              updatedAt: new Date()
            },
            $unset: {
              password: 1 // Remove password field
            }
          }
        );
        
        console.log(`✅ Migrated: ${userMapping.old_email} -> ${userMapping.clerk_user_id}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error migrating ${userMapping.old_email}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Migration Summary:`);
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📝 Total: ${mapping.users.length}`);
    
  } catch (error) {
    console.error("❌ Error applying migration:", error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const applyFlag = args.includes('--apply');
  const mappingFile = args.find(arg => arg.startsWith('--mapping='))?.split('=')[1] || 'user-migration-mapping.json';
  
  await connectDB();
  
  if (applyFlag) {
    console.log("🚀 Applying migration...");
    await applyMigration(mappingFile);
  } else {
    console.log("📋 Listing existing users and generating migration mapping...");
    const users = await listExistingUsers();
    await generateMigrationMapping(users);
  }
  
  await mongoose.disconnect();
  console.log("✅ Disconnected from MongoDB");
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { listExistingUsers, generateMigrationMapping, applyMigration };
