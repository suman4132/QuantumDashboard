const axios = require('axios');

async function checkBackends() {
  try {
    console.log('Checking /api/backends...');
    const res1 = await axios.get('http://localhost:5000/api/backends');
    console.log(`Status: ${res1.status}`);
    console.log(`Count: ${res1.data.length}`);
    console.log('Sample Data:', res1.data.slice(0, 2));

    console.log('\nChecking /api/ibm-quantum/live...');
    const res2 = await axios.get('http://localhost:5000/api/ibm-quantum/live');
    console.log(`Status: ${res2.status}`);
    console.log('Live Data Summary:', {
        timestamp: res2.data.timestamp,
        backendsCount: res2.data.backends.length,
        isSimulated: res2.data.isSimulated
    });

  } catch (error) {
    if (error.response) {
        console.log(`Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else {
        console.log('Error:', error.message);
        console.log('Error details:', error);
    }
  }
}

checkBackends();
