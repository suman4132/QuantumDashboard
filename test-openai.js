/**
 * Quick OpenAI Connection Test Script
 * Run this to test if your OpenAI API key is working
 * 
 * Usage: node test-openai.js
 */

import { config } from 'dotenv';
import OpenAI from 'openai';

config();

const apiKey = process.env.OPENAI_API_KEY;

console.log('\n🔍 OpenAI Connection Test\n');
console.log('='.repeat(50));

// Check 1: API Key exists
if (!apiKey) {
  console.log('❌ OPENAI_API_KEY not found in environment variables');
  console.log('\n💡 Solution:');
  console.log('   1. Create .env file in project root');
  console.log('   2. Add: OPENAI_API_KEY=sk-your-key-here');
  console.log('   3. Get key from: https://platform.openai.com/api-keys');
  process.exit(1);
}

console.log('✅ API Key found in environment');

// Check 2: API Key format
if (!apiKey.startsWith('sk-')) {
  console.log('❌ API Key format is invalid');
  console.log('   Expected format: sk-...');
  console.log(`   Your key starts with: ${apiKey.substring(0, 5)}...`);
  process.exit(1);
}

console.log('✅ API Key format is valid');

// Check 3: Initialize client
let client;
try {
  client = new OpenAI({ apiKey });
  console.log('✅ OpenAI client initialized');
} catch (error) {
  console.log('❌ Failed to initialize OpenAI client');
  console.log('   Error:', error.message);
  process.exit(1);
}

// Check 4: Test API call
console.log('\n🔄 Testing API connection...');
client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'Say "Hello, OpenAI is working!" if you can read this.' }
  ],
  max_tokens: 20,
})
  .then(response => {
    const content = response.choices[0]?.message?.content;
    console.log('✅ API call successful!');
    console.log('📝 Response:', content);
    console.log('\n' + '='.repeat(50));
    console.log('🎉 OpenAI is configured correctly!');
    console.log('✅ You can now use AI features in QuantumCloud');
    process.exit(0);
  })
  .catch(error => {
    console.log('❌ API call failed');
    console.log('\nError Details:');
    console.log('   Status:', error.status || 'Unknown');
    console.log('   Message:', error.message || 'Unknown error');
    
    if (error.status === 401) {
      console.log('\n💡 This usually means:');
      console.log('   - API key is invalid or expired');
      console.log('   - API key has been revoked');
      console.log('   Solution: Get a new key from https://platform.openai.com/api-keys');
    } else if (error.status === 429) {
      console.log('\n💡 This usually means:');
      console.log('   - Rate limit exceeded');
      console.log('   - Too many requests');
      console.log('   Solution: Wait a minute and try again');
    } else if (error.status === 500) {
      console.log('\n💡 This usually means:');
      console.log('   - OpenAI service is temporarily down');
      console.log('   Solution: Check https://status.openai.com');
    } else {
      console.log('\n💡 Check:');
      console.log('   - Network connectivity');
      console.log('   - Firewall settings');
      console.log('   - OpenAI status page');
    }
    
    process.exit(1);
  });

