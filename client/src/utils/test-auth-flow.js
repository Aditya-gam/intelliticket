/**
 * Frontend Authentication Flow Test
 * This utility helps test the complete authentication flow in the browser
 */

// Test authentication state
export function testAuthState() {
  console.log("🧪 Testing Authentication State...");
  
  // Check if Clerk is loaded
  if (typeof window !== 'undefined' && window.Clerk) {
    console.log("✅ Clerk is loaded");
    return true;
  } else {
    console.log("❌ Clerk is not loaded");
    return false;
  }
}

// Test API calls
export async function testAPICalls() {
  console.log("🧪 Testing API Calls...");
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${import.meta.env.VITE_SERVER_URL.replace('/api', '')}/health`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("✅ Health endpoint accessible:", healthData.status);
    } else {
      console.log("❌ Health endpoint not accessible");
      return false;
    }
    
    return true;
  } catch (error) {
    console.log("❌ API test failed:", error.message);
    return false;
  }
}

// Test environment variables
export function testEnvironment() {
  console.log("🧪 Testing Environment Variables...");
  
  const requiredVars = [
    'VITE_SERVER_URL',
    'VITE_CLERK_PUBLISHABLE_KEY'
  ];
  
  let allPresent = true;
  
  requiredVars.forEach(varName => {
    const value = import.meta.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`❌ ${varName}: Not set`);
      allPresent = false;
    }
  });
  
  return allPresent;
}

// Test Clerk configuration
export function testClerkConfig() {
  console.log("🧪 Testing Clerk Configuration...");
  
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    console.log("❌ Clerk publishable key not set");
    return false;
  }
  
  if (publishableKey.startsWith('pk_test_') || publishableKey.startsWith('pk_live_')) {
    console.log("✅ Clerk publishable key format is correct");
    return true;
  } else {
    console.log("❌ Clerk publishable key format is incorrect");
    return false;
  }
}

// Run all frontend tests
export async function runFrontendTests() {
  console.log("🚀 Frontend Authentication Tests");
  console.log("=".repeat(40));
  
  const tests = [
    { name: "Environment Variables", test: testEnvironment },
    { name: "Clerk Configuration", test: testClerkConfig },
    { name: "Authentication State", test: testAuthState },
    { name: "API Calls", test: testAPICalls },
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
  
  console.log("\n📊 Frontend Test Results:");
  console.log("=".repeat(30));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach((result, index) => {
    const status = result.passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${index + 1}. ${result.name}: ${status}`);
  });
  
  console.log(`\nOverall: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log("🎉 All frontend tests passed!");
  } else {
    console.log("⚠️  Some frontend tests failed.");
  }
  
  return passed === total;
}

// Manual testing checklist
export function getManualTestChecklist() {
  return [
    "1. Visit http://localhost:5173",
    "2. Should redirect to sign-in page",
    "3. Create a new account with Clerk",
    "4. Should redirect to home page after sign-in",
    "5. Test creating a ticket",
    "6. Test viewing ticket details",
    "7. Test admin panel (if admin role)",
    "8. Test sign out functionality",
    "9. Test protected route access",
    "10. Test API error handling"
  ];
}

// Export for console testing
if (typeof window !== 'undefined') {
  window.testAuthFlow = {
    testAuthState,
    testAPICalls,
    testEnvironment,
    testClerkConfig,
    runFrontendTests,
    getManualTestChecklist
  };
  
  console.log("🧪 Frontend test utilities loaded. Use window.testAuthFlow.runFrontendTests() to run tests.");
}
