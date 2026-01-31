/**
 * Setup .env file with OpenAI API key
 * Run: node setup-env.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '.env');

const envContent = `# OpenAI API Configuration
OPENAI_API_KEY=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

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/quantumcloud
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/quantumcloud

# JWT Secret (Change this in production!)
JWT_SECRET=quantumcloud-super-secret-jwt-key-change-in-production-2025

# Server Configuration
PORT=5000
NODE_ENV=development

# IBM Quantum API (Optional)
# IBM_QUANTUM_API_TOKEN=your_ibm_token_here
# IBM_QUANTUM_PROJECT_ID=your_project_id_here
# IBM_QUANTUM_INSTANCE_ID=your_instance_id_here
# IBM_QUANTUM_REGION=us-east

# Database (PostgreSQL - Optional, for other features)
# DATABASE_URL=postgresql://user:password@localhost:5432/quantumcloud
`;

try {
  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists');
    console.log('📝 Reading current .env file...');
    const currentContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if OPENAI_API_KEY already exists
    if (currentContent.includes('OPENAI_API_KEY=')) {
      console.log('✅ OPENAI_API_KEY already exists in .env');
      console.log('💡 If you want to update it, edit .env file manually');
      
      // Update just the OPENAI_API_KEY line
      const updatedContent = currentContent.replace(
        /OPENAI_API_KEY=.*/,
        'OPENAI_API_KEY=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'
      );
      
      fs.writeFileSync(envPath, updatedContent, 'utf8');
      console.log('✅ Updated OPENAI_API_KEY in .env file');
    } else {
      // Append OPENAI_API_KEY to existing file
      fs.appendFileSync(envPath, `\nOPENAI_API_KEY=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\n`);
      console.log('✅ Added OPENAI_API_KEY to existing .env file');
    }
  } else {
    // Create new .env file
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ Created .env file with OpenAI API key');
  }
  
  console.log('\n📋 .env file contents:');
  console.log('='.repeat(50));
  const finalContent = fs.readFileSync(envPath, 'utf8');
  // Hide the actual API key in output for security
  const maskedContent = finalContent.replace(
    /OPENAI_API_KEY=(sk-[^\s]+)/,
    'OPENAI_API_KEY=sk-***hidden***'
  );
  console.log(maskedContent);
  console.log('='.repeat(50));
  
  console.log('\n✅ Setup complete!');
  console.log('💡 Next steps:');
  console.log('   1. Restart your server: npm run dev');
  console.log('   2. Test OpenAI: npm run test:openai');
  console.log('   3. Check status: curl http://localhost:5000/api/ai/status');
  
} catch (error) {
  console.error('❌ Error setting up .env file:', error.message);
  console.log('\n💡 Manual setup:');
  console.log('   1. Create .env file in project root');
  console.log('   2. Add: OPENAI_API_KEY=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');
  process.exit(1);
}

