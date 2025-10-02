import { verifyToken } from "@clerk/backend";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Test script to verify Clerk authentication setup
 * This script will test:
 * 1. Clerk secret key configuration
 * 2. Token verification functionality
 * 3. Environment variable setup
 */

async function testClerkConfiguration() {
  console.log("🧪 Testing Clerk Configuration...");
  console.log("=" * 40);
  
  // Test 1: Check environment variables
  console.log("\n1️⃣ Checking environment variables:");
  
  const requiredVars = [
    'CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'CLERK_WEBHOOK_SECRET'
  ];
  
  let allVarsPresent = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`❌ ${varName}: Not set`);
      allVarsPresent = false;
    }
  });
  
  if (!allVarsPresent) {
    console.log("\n❌ Missing required environment variables!");
    console.log("Please check your .env file and ensure all Clerk keys are set.");
    return false;
  }
  
  // Test 2: Check key formats
  console.log("\n2️⃣ Validating key formats:");
  
  const publishableKey = process.env.CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_')) {
    console.log("✅ Publishable key format is correct");
  } else {
    console.log("❌ Publishable key format is incorrect (should start with pk_test_ or pk_live_)");
    allVarsPresent = false;
  }
  
  if (secretKey.startsWith('sk_test_') || secretKey.startsWith('sk_live_')) {
    console.log("✅ Secret key format is correct");
  } else {
    console.log("❌ Secret key format is incorrect (should start with sk_test_ or sk_live_)");
    allVarsPresent = false;
  }
  
  if (webhookSecret.startsWith('whsec_')) {
    console.log("✅ Webhook secret format is correct");
  } else {
    console.log("❌ Webhook secret format is incorrect (should start with whsec_)");
    allVarsPresent = false;
  }
  
  // Test 3: Test token verification (with mock token)
  console.log("\n3️⃣ Testing token verification:");
  
  try {
    // This will fail with a mock token, but we can test the function exists
    await verifyToken("mock_token", {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    console.log("✅ Token verification function is working");
  } catch (error) {
    if (error.message.includes("Invalid token") || error.message.includes("jwt")) {
      console.log("✅ Token verification function is working (expected error with mock token)");
    } else {
      console.log("❌ Token verification error:", error.message);
      allVarsPresent = false;
    }
  }
  
  return allVarsPresent;
}

async function testDatabaseConnection() {
  console.log("\n4️⃣ Testing database connection:");
  
  try {
    const mongoose = await import("mongoose");
    await mongoose.default.connect(process.env.MONGO_URI);
    console.log("✅ Database connection successful");
    
    // Test User model
    const User = (await import("../models/user.js")).default;
    const userCount = await User.countDocuments();
    console.log(`✅ User model accessible (${userCount} users in database)`);
    
    await mongoose.default.disconnect();
    return true;
  } catch (error) {
    console.log("❌ Database connection failed:", error.message);
    return false;
  }
}

async function generateTestInstructions() {
  console.log("\n📋 Next Steps for Testing:");
  console.log("=" * 40);
  console.log("1. Start your server: pnpm s dev");
  console.log("2. Start your client: pnpm c dev");
  console.log("3. Test webhook endpoint:");
  console.log("   curl -X POST http://localhost:3000/api/webhooks/clerk \\");
  console.log("     -H 'Content-Type: application/json' \\");
  console.log("     -H 'svix-id: test' \\");
  console.log("     -H 'svix-timestamp: 1234567890' \\");
  console.log("     -H 'svix-signature: test' \\");
  console.log("     -d '{\"type\":\"user.created\",\"data\":{\"id\":\"test\"}}'");
  console.log("\n4. Test authentication endpoint:");
  console.log("   curl -X GET http://localhost:3000/api/auth/profile \\");
  console.log("     -H 'Authorization: Bearer YOUR_CLERK_SESSION_TOKEN'");
  console.log("\n5. Check server logs for any errors");
}

async function main() {
  console.log("🚀 Clerk Authentication Test Suite");
  console.log("=" * 50);
  
  const configOk = await testClerkConfiguration();
  const dbOk = await testDatabaseConnection();
  
  console.log("\n📊 Test Results:");
  console.log("=" * 20);
  console.log(`Configuration: ${configOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Database: ${dbOk ? '✅ PASS' : '❌ FAIL'}`);
  
  if (configOk && dbOk) {
    console.log("\n🎉 All tests passed! Your Clerk setup is ready.");
  } else {
    console.log("\n⚠️  Some tests failed. Please fix the issues above.");
  }
  
  await generateTestInstructions();
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { testClerkConfiguration, testDatabaseConnection };
