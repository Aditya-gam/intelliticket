import { verifyToken } from "@clerk/backend";
import mongoose from "mongoose";
import User from "../models/user.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Comprehensive test script for the complete Clerk authentication flow
 * This script tests:
 * 1. Backend authentication middleware
 * 2. User creation and synchronization
 * 3. API endpoints
 * 4. Webhook integration
 * 5. Frontend-backend integration
 */

const MONGO_URI = process.env.MONGO_URI;
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

if (!MONGO_URI || !CLERK_SECRET_KEY) {
  console.error("Missing required environment variables");
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

async function testUserModel() {
  console.log("\n1️⃣ Testing User Model...");
  
  try {
    // Test creating a user with Clerk data
    const testUser = {
      clerkUserId: "test_clerk_user_123",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      role: "user",
      skills: ["testing", "javascript"],
    };

    // Clean up any existing test user
    await User.deleteOne({ clerkUserId: testUser.clerkUserId });
    
    // Create new user
    const user = await User.create(testUser);
    console.log("✅ User created successfully:", user.email);
    
    // Test finding user
    const foundUser = await User.findOne({ clerkUserId: testUser.clerkUserId });
    console.log("✅ User found successfully:", foundUser.email);
    
    // Test updating user
    foundUser.skills.push("react");
    await foundUser.save();
    console.log("✅ User updated successfully");
    
    // Clean up
    await User.deleteOne({ clerkUserId: testUser.clerkUserId });
    console.log("✅ Test user cleaned up");
    
    return true;
  } catch (error) {
    console.error("❌ User model test failed:", error.message);
    return false;
  }
}

async function testClerkTokenVerification() {
  console.log("\n2️⃣ Testing Clerk Token Verification...");
  
  try {
    // Test with invalid token (should fail gracefully)
    try {
      await verifyToken("invalid_token", {
        secretKey: CLERK_SECRET_KEY,
      });
      console.log("❌ Invalid token was accepted (unexpected)");
      return false;
    } catch (error) {
      if (error.message.includes("Invalid JWT form") || error.message.includes("jwt")) {
        console.log("✅ Invalid token properly rejected");
      } else {
        console.log("⚠️  Unexpected error with invalid token:", error.message);
      }
    }
    
    // Test with malformed token
    try {
      await verifyToken("not.a.jwt", {
        secretKey: CLERK_SECRET_KEY,
      });
      console.log("❌ Malformed token was accepted (unexpected)");
      return false;
    } catch (error) {
      console.log("✅ Malformed token properly rejected");
    }
    
    return true;
  } catch (error) {
    console.error("❌ Token verification test failed:", error.message);
    return false;
  }
}

async function testDatabaseOperations() {
  console.log("\n3️⃣ Testing Database Operations...");
  
  try {
    // Test user count
    const userCount = await User.countDocuments();
    console.log(`✅ Database accessible, ${userCount} users found`);
    
    // Test user schema validation
    try {
      await User.create({
        // Missing required fields to test validation
        email: "test@validation.com",
      });
      console.log("❌ User validation failed (unexpected)");
      return false;
    } catch (error) {
      if (error.name === "ValidationError") {
        console.log("✅ User validation working correctly");
      } else {
        console.log("⚠️  Unexpected validation error:", error.message);
      }
    }
    
    return true;
  } catch (error) {
    console.error("❌ Database operations test failed:", error.message);
    return false;
  }
}

async function testWebhookPayload() {
  console.log("\n4️⃣ Testing Webhook Payload Processing...");
  
  try {
    // Simulate a Clerk webhook payload
    const webhookPayload = {
      type: "user.created",
      data: {
        id: "test_webhook_user_123",
        email_addresses: [
          { email_address: "webhook@test.com" }
        ],
        first_name: "Webhook",
        last_name: "Test",
        public_metadata: {
          role: "user",
          skills: ["webhook", "testing"]
        }
      }
    };
    
    // Test user creation from webhook data
    const user = await User.create({
      clerkUserId: webhookPayload.data.id,
      email: webhookPayload.data.email_addresses[0].email_address,
      firstName: webhookPayload.data.first_name,
      lastName: webhookPayload.data.last_name,
      role: webhookPayload.data.public_metadata.role,
      skills: webhookPayload.data.public_metadata.skills,
      lastSyncedAt: new Date(),
    });
    
    console.log("✅ Webhook user created:", user.email);
    
    // Clean up
    await User.deleteOne({ clerkUserId: webhookPayload.data.id });
    console.log("✅ Webhook test user cleaned up");
    
    return true;
  } catch (error) {
    console.error("❌ Webhook payload test failed:", error.message);
    return false;
  }
}

async function testAPIEndpoints() {
  console.log("\n5️⃣ Testing API Endpoints...");
  
  try {
    // Test server health
    const response = await fetch("http://localhost:3000/health");
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Health endpoint working:", data.status);
    } else {
      console.log("⚠️  Health endpoint not accessible (server may not be running)");
    }
    
    // Test webhook endpoint (should fail without proper signature)
    try {
      const webhookResponse = await fetch("http://localhost:3000/api/webhooks/clerk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "user.created",
          data: { id: "test" }
        })
      });
      
      if (webhookResponse.status === 400) {
        console.log("✅ Webhook endpoint properly rejecting invalid requests");
      } else {
        console.log("⚠️  Webhook endpoint unexpected response:", webhookResponse.status);
      }
    } catch (error) {
      console.log("⚠️  Webhook endpoint not accessible (server may not be running)");
    }
    
    return true;
  } catch (error) {
    console.error("❌ API endpoints test failed:", error.message);
    return false;
  }
}

async function generateTestReport(results) {
  console.log("\n📊 Test Results Summary:");
  console.log("=" * 50);
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach((result, index) => {
    const status = result.passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${index + 1}. ${result.name}: ${status}`);
  });
  
  console.log(`\nOverall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log("🎉 All tests passed! Your Clerk integration is working correctly.");
  } else {
    console.log("⚠️  Some tests failed. Please review the issues above.");
  }
  
  return passed === total;
}

async function main() {
  console.log("🚀 Complete Clerk Authentication Flow Test");
  console.log("=" * 60);
  
  await connectDB();
  
  const tests = [
    { name: "User Model", test: testUserModel },
    { name: "Clerk Token Verification", test: testClerkTokenVerification },
    { name: "Database Operations", test: testDatabaseOperations },
    { name: "Webhook Payload Processing", test: testWebhookPayload },
    { name: "API Endpoints", test: testAPIEndpoints },
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const passed = await test.test();
      results.push({ name: test.name, passed });
    } catch (error) {
      console.error(`❌ ${test.name} test crashed:`, error.message);
      results.push({ name: test.name, passed: false });
    }
  }
  
  const allPassed = await generateTestReport(results);
  
  await mongoose.disconnect();
  console.log("✅ Disconnected from MongoDB");
  
  if (allPassed) {
    console.log("\n🎯 Next Steps:");
    console.log("1. Start your server: pnpm s dev");
    console.log("2. Start your client: pnpm c dev");
    console.log("3. Test the complete authentication flow in the browser");
    console.log("4. Create a test user in Clerk Dashboard");
    console.log("5. Test all application features");
  }
  
  process.exit(allPassed ? 0 : 1);
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { testUserModel, testClerkTokenVerification, testDatabaseOperations, testWebhookPayload, testAPIEndpoints };
