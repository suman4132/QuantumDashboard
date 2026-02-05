require('dotenv').config();
const axios = require('axios');

async function debugIBMQuantum() {
  const apiKey = process.env.IBM_QUANTUM_API_TOKEN;
  
  console.log('--- IBM Quantum Debugger ---');
  
  if (!apiKey) {
    console.error('❌ ERROR: IBM_QUANTUM_API_TOKEN is not defined in .env or environment variables.');
    return;
  }

  // Masked key for safety in logs
  console.log(`✅ API Token found: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);

  try {
    console.log('🔄 Attempting to authenticate with IBM Cloud (IAM)...');
    
    // IBM Cloud IAM Auth (New Method)
    const iamResponse = await axios.post('https://iam.cloud.ibm.com/identity/token',
      `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
    );

    console.log('✅ IBM Cloud IAM Authentication Successful!');
    const accessToken = iamResponse.data.access_token;
    
    // Now try to fetch backends using the token
    console.log('🔄 Fetching backends using access token...');
    
    try {
        const backendsResponse = await axios.get('https://quantum.cloud.ibm.com/api/v1/backends', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Service-CRN': process.env.IBM_QUANTUM_INSTANCE_ID || '' // CRN might be required
            }
        });
        const list = backendsResponse.data.devices || backendsResponse.data;
        console.log(`✅ Backends fetch successful! Found ${list ? list.length : '0 (response data structure unexpected)'} backends/devices.`);
    } catch (backendError) {
        console.error('⚠️ Authenticated but failed to fetch backends from Cloud endpoint.');
        if (backendError.response) {
            console.error(`   Status: ${backendError.response.status}`);
            console.error(`   Data: ${JSON.stringify(backendError.response.data)}`);
            if (backendError.response.status === 401 || backendError.response.status === 403) {
                console.error('   Hint: You might need to specify a valid IBM_QUANTUM_INSTANCE_ID (CRN) in .env for this request.');
            }
        } else {
             console.error(`   Error: ${backendError.message}`);
        }
    }

  } catch (iamError) {
    console.warn('⚠️ IBM Cloud IAM Auth failed. Trying Legacy Auth...');
    // console.error('IAM Error Details:', iamError.response ? iamError.response.data : iamError.message);

    // Legacy Auth (Old IQX)
    try {
        console.log('🔄 Attempting Legacy LoginWithToken...');
        const legacyResponse = await axios.post('https://auth.quantum-computing.ibm.com/api/users/loginWithToken', {
            apiToken: apiKey
        });

        console.log('✅ Legacy Authentication Successful!');
        const legacyToken = legacyResponse.data.id;
        
        console.log('🔄 Fetching backends with Legacy Token...');
        const legacyBackends = await axios.get('https://api.quantum-computing.ibm.com/api/Backends', {
            headers: { 'X-Access-Token': legacyToken }
        });
        console.log(`✅ Legacy Backends fetch successful! Found ${legacyBackends.data.length} items.`);

    } catch (legacyError) {
        console.error('❌ Legacy Auth also failed.');
        console.error('--- DIAGNOSIS ---');
        console.error('1. Your API Token might be invalid or expired.');
        console.error('2. If you are using a new IBM Cloud Quantum service, make sure you are using the API Key for the Service ID, not your personal user.');
        
        if (iamError.response) {
             console.log('\nIBM Cloud IAM Error:', JSON.stringify(iamError.response.data, null, 2));
        }
        if (legacyError.response) {
             console.log('\nLegacy Auth Error:', JSON.stringify(legacyError.response.data, null, 2));
        }
    }
  }
}

debugIBMQuantum();
