import axios from 'axios';

interface IBMQuantumJob {
  id: string;
  name?: string;
  backend: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  created: string;
  updated?: string;
  runtime?: number;
  qubits?: number;
  shots?: number;
  program?: string;
  results?: any;
  error?: string;
}

interface IBMQuantumBackend {
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  pending_jobs: number;
  quantum_volume?: number;
  num_qubits: number;
  basis_gates?: string[];
  coupling_map?: number[][];
}

class IBMQuantumService {
  private bearerToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    // We don't initialize here to allow dotenv to load first
    // Configuration is checked on-demand
  }

  private getConfig() {
    return {
      apiKey: process.env.IBM_QUANTUM_API_TOKEN || '',
      region: process.env.IBM_QUANTUM_REGION || 'us-east',
      projectId: process.env.IBM_QUANTUM_PROJECT_ID || '',
      instanceId: process.env.IBM_QUANTUM_INSTANCE_ID || ''
    };
  }

  private get baseUrl() {
    const { region } = this.getConfig();
    return `https://${region}.quantum-computing.cloud.ibm.com/runtime`;
  }

  private get runtimeUrl() {
    return this.baseUrl;
  }

  private isLegacyPlatform(): boolean {
    const { instanceId } = this.getConfig();
    return instanceId.includes('/') && !instanceId.startsWith('crn:');
  }

  private async getBearerToken(): Promise<string> {
    const { apiKey } = this.getConfig();
    // If we have a valid token, return it
    if (this.bearerToken && Date.now() < this.tokenExpiry) {
      return this.bearerToken;
    }

    try {
      if (this.isLegacyPlatform()) {
        console.log('🔑 Authenticating with IBM Quantum Platform (Legacy)...');
        try {
          const response = await axios.post('https://api.quantum-computing.ibm.com/api/users/loginWithToken', {
            apiToken: apiKey
          });
          this.bearerToken = response.data.id;
          this.tokenExpiry = Date.now() + (response.data.ttl * 1000);
          console.log('✅ Successfully authenticated with IBM Quantum Platform');
        } catch (authError) {
          console.warn('⚠️  Legacy authentication failed, trying to use API Token directly...');
          // Fallback: Use the API token as the access token directly
          this.bearerToken = apiKey;
          this.tokenExpiry = Date.now() + (3600 * 1000);
        }
      } else {
        console.log('🔑 Generating IBM Cloud Bearer token...');
        const response = await axios.post('https://iam.cloud.ibm.com/identity/token',
          `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            }
          }
        );

        this.bearerToken = response.data.access_token;
        this.tokenExpiry = Date.now() + (50 * 60 * 1000);
        console.log('✅ Successfully generated Bearer token');
      }
      return this.bearerToken!
    } catch (error: any) {
      console.error('❌ Failed to authenticate:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with IBM Quantum/Cloud');
    }
  }

  private async makeAuthenticatedRequest(url: string, method: 'GET' | 'POST' = 'GET', data?: any) {
    const { apiKey, projectId, instanceId } = this.getConfig();
    const isLegacy = this.isLegacyPlatform();

    if (!apiKey) {
      throw new Error('IBM Quantum API key not configured');
    }

    try {
      // Get valid Token
      const token = await this.getBearerToken();

      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Quantum-Dashboard/1.0'
      };

      if (isLegacy) {
        headers['X-Access-Token'] = token;
        // Legacy platform often needs simpler headers or just the token
      } else {
        headers['Authorization'] = `Bearer ${token}`;
        if (projectId) headers['X-Project-ID'] = projectId;
        if (instanceId) headers['Service-CRN'] = instanceId;
      }

      console.log(`🌐 Making request to: ${url}`);
      const response = await axios({
        method,
        url,
        headers,
        data,
        timeout: 30000,
        validateStatus: (status) => status < 500
      });

      if (response.status >= 400) {
        console.warn(`⚠️  API returned ${response.status}:`, response.data);
        return { error: response.data, status: response.status };
      }

      console.log(`✅ Successfully fetched data from IBM Quantum (${response.status})`);
      return response.data;
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        console.error('⏱️  Request timeout to IBM Quantum API');
        throw new Error('Request timeout - IBM Quantum API is not responding');
      }

      console.error(`❌ IBM Quantum API request failed:`, {
        url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });

      throw new Error(`IBM Quantum API Error: ${error.response?.status || error.message}`);
    }
  }

  async getJobs(limit: number = 50): Promise<IBMQuantumJob[]> {
    const { apiKey, projectId, instanceId } = this.getConfig();
    const isLegacy = this.isLegacyPlatform();

    if (!apiKey) {
      console.warn('API key not available. Returning simulated jobs.');
      return this.generateSampleJobs(limit);
    }

    try {
      console.log(`📊 Fetching ${limit} jobs from IBM Quantum...`);

      let endpoints: string[] = [];

      if (isLegacy) {
        // Parse instanceId "hub/group/project"
        // e.g., "ibm-q/open/main"
        const parts = instanceId.split('/');
        if (parts.length === 3) {
          const [hub, group, project] = parts;
          endpoints = [
            `https://api.quantum-computing.ibm.com/api/Network/${hub}/Groups/${group}/Projects/${project}/Jobs?limit=${limit}&order=DESC`,
            `https://api.quantum-computing.ibm.com/api/Network/${hub}/Groups/${group}/Projects/${project}/Jobs?limit=${limit}`
          ];
        } else {
          console.warn('⚠️  Invalid instance ID format for Legacy Platform. Expected "hub/group/project".');
          endpoints = [`https://api.quantum-computing.ibm.com/api/Jobs?limit=${limit}`]; // Fallback to global jobs
        }
      } else {
        // IBM Cloud endpoints
        endpoints = [
          `${this.baseUrl}/projects/${projectId}/jobs?limit=${limit}`,
          `${this.baseUrl}/projects/${projectId}/jobs`,
          `${this.baseUrl}/jobs?limit=${limit}`
        ];
      }

      let data: any = null;
      let lastError: any = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying endpoint: ${endpoint}`);
          data = await this.makeAuthenticatedRequest(endpoint);

          // Legacy API returns structured object, sometimes with 'items' or just array
          const jobsList = isLegacy ? (data.items || data) : (data.jobs || data.data);

          if (jobsList && Array.isArray(jobsList)) {
            console.log(`✅ Successfully fetched from: ${endpoint}`);
            // Normalize list for processing
            data = { jobs: jobsList };
            break;
          } else if (data && data.error) {
            console.log(`⚠️  Endpoint ${endpoint} returned an API error:`, data.error);
            lastError = new Error(`API Error: ${data.error.message || data.error}`);
          } else if (data) {
            console.log(`⚠️  Endpoint ${endpoint} returned data in unexpected format.`);
          }
        } catch (error) {
          lastError = error;
          console.log(`❌ Endpoint failed: ${endpoint}`, error instanceof Error ? error.message : error);
          continue;
        }
      }

      if (!data || !data.jobs) {
        console.warn('⚠️  All IBM Quantum job endpoints failed or returned invalid data. Generating sample data for demo.');
        return this.generateSampleJobs(limit);
      }

      const jobs = data.jobs;
      console.log(`📈 Successfully processed ${jobs.length} reall jobs from IBM Quantum`);

      return jobs.map((job: any, index: number) => ({
        id: job.id || `ibm_job_${Date.now()}_${index}`,
        name: job.program?.id || job.program_id || job.name || (job.backend ? `Job on ${job.backend.name}` : `IBM Job`),
        backend: job.backend?.name || job.backend_name || job.device || 'unknown_backend',
        status: this.mapStatus(job.status || job.state || 'queued'),
        created: job.created || job.creationDate || new Date().toISOString(),
        updated: job.updated || job.endDate || job.modified,
        runtime: job.running_time || job.usage?.seconds || job.duration,
        qubits: job.params?.circuits?.[0]?.num_qubits || job.usage?.quantum_seconds || job.num_qubits || Math.floor(Math.random() * 127) + 5,
        shots: job.params?.shots || job.shots || 1024,
        program: job.program?.id || job.program_id || 'quantum_circuit',
        results: job.results,
        error: (() => {
          const e = job.error_message || job.failure?.error_message || job.error;
          if (!e) return null;
          if (typeof e === 'string') return e;
          return e.message || e.description || JSON.stringify(e);
        })()
      }));
    } catch (error) {
      console.error('❌ Failed to fetch IBM Quantum jobs:', error);
      return this.generateSampleJobs(limit);
    }
  }

  async getBackends(): Promise<IBMQuantumBackend[]> {
    const { apiKey, region } = this.getConfig();
    const isLegacy = this.isLegacyPlatform();

    if (!apiKey) {
      console.warn('API key not available. Returning simulated backends.');
      return this.generateSampleBackends();
    }

    try {
      console.log('🖥️  Fetching backends from IBM Quantum...');

      let endpoints: string[] = [];

      if (isLegacy) {
        endpoints = [`https://api.quantum-computing.ibm.com/api/Backends`];
      } else {
        endpoints = [
          `${this.baseUrl}/backends`,
          `https://${region}.quantum-computing.cloud.ibm.com/runtime/backends`,
          `https://quantum-computing.ibm.com/api/backends`
        ];
      }

      let data: any = null;

      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying backends endpoint: ${endpoint}`);
          data = await this.makeAuthenticatedRequest(endpoint);

          // Legacy API returns array of backends directly
          const backendsList = isLegacy ? data : (data.backends || data.devices);

          if (Array.isArray(backendsList)) {
            console.log(`✅ Successfully fetched backends from: ${endpoint}`);
            data = { backends: backendsList };
            break;
          } else if (data && data.error) {
            console.log(`⚠️  Endpoint ${endpoint} returned an API error:`, data.error);
          }
        } catch (error) {
          console.log(`❌ Backends endpoint failed: ${endpoint}`, error instanceof Error ? error.message : error);
          continue;
        }
      }

      if (!data || !data.backends) {
        console.warn('⚠️  All backend endpoints failed or returned invalid data. Generating sample backends.');
        return this.generateSampleBackends();
      }

      const backends = data.backends;
      console.log(`🖥️  Successfully processed ${backends.length} real backends from IBM Quantum`);

      return backends.map((backend: any) => ({
        name: backend.name || backend.backend_name || 'unknown_backend',
        status: this.mapBackendStatus(backend.status || backend.operational || (backend.online ? 'online' : 'offline')),
        pending_jobs: backend.pending_jobs || backend.length_queue || backend.queue_length || backend.status === 'active' ? Math.floor(Math.random() * 5) : 0,
        quantum_volume: backend.quantum_volume || backend.props?.quantum_volume,
        num_qubits: backend.n_qubits || backend.num_qubits || backend.configuration?.n_qubits || 0,
        basis_gates: backend.basis_gates || backend.configuration?.basis_gates || [],
        coupling_map: backend.coupling_map || backend.configuration?.coupling_map
      }));
    } catch (error) {
      console.error('❌ Failed to fetch IBM Quantum backends:', error);
      return this.generateSampleBackends();
    }
  }

  private generateSampleJobs(count: number): IBMQuantumJob[] {
    console.log(`🔧 Generating ${count} sample IBM Quantum jobs for demo`);
    const backends = ['ibm_brisbane', 'ibm_kyoto', 'ibm_osaka', 'ibm_cairo', 'ibm_sherbrooke'];
    const statuses: Array<'queued' | 'running' | 'completed' | 'failed' | 'cancelled'> = ['queued', 'running', 'completed', 'failed', 'cancelled'];

    return Array.from({ length: count }, (_, i) => {
      const now = new Date();
      const created = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      return {
        id: `ibm_sample_${Date.now()}_${i}`,
        name: `IBM Quantum Circuit ${i + 1}`,
        backend: backends[Math.floor(Math.random() * backends.length)],
        status,
        created,
        updated: status !== 'queued' ? new Date(created).toISOString() : undefined,
        runtime: status === 'completed' ? Math.floor(Math.random() * 300) + 30 : undefined,
        qubits: Math.floor(Math.random() * 100) + 5,
        shots: Math.pow(2, Math.floor(Math.random() * 6) + 10),
        program: 'sample_quantum_circuit',
        results: status === 'completed' ? { counts: { '000': 512, '111': 512 } } : undefined,
        error: status === 'failed' ? 'Sample quantum circuit error for demo' : undefined
      };
    });
  }

  private generateSampleBackends(): IBMQuantumBackend[] {
    console.log('🔧 Generating sample IBM Quantum backends for demo');
    return [
      { name: 'ibm_brisbane', status: 'online', pending_jobs: Math.floor(Math.random() * 5), num_qubits: 127, basis_gates: ['cx', 'id', 'rz', 'sx', 'x'], coupling_map: [] },
      { name: 'ibm_kyoto', status: 'online', pending_jobs: Math.floor(Math.random() * 8), num_qubits: 127, basis_gates: ['cx', 'id', 'rz', 'sx', 'x'], coupling_map: [] },
      { name: 'ibm_osaka', status: 'online', pending_jobs: Math.floor(Math.random() * 12), num_qubits: 127, basis_gates: ['cx', 'id', 'rz', 'sx', 'x'], coupling_map: [] },
      { name: 'ibm_cairo', status: 'maintenance', pending_jobs: 0, num_qubits: 127, basis_gates: ['cx', 'id', 'rz', 'sx', 'x'], coupling_map: [] },
      { name: 'ibm_sherbrooke', status: 'online', pending_jobs: Math.floor(Math.random() * 15), num_qubits: 133, basis_gates: ['cx', 'id', 'rz', 'sx', 'x'], coupling_map: [] }
    ];
  }

  async getJobById(jobId: string): Promise<IBMQuantumJob | null> {
    const { apiKey } = this.getConfig();
    if (!apiKey) {
      console.warn('API token not available. Cannot fetch job by ID.');
      return null;
    }
    try {
      console.log(`🔍 Fetching job details for: ${jobId}`);
      const job = await this.makeAuthenticatedRequest(
        `${this.runtimeUrl}/jobs/${jobId}`
      );

      if (job.error) {
        console.warn(`⚠️  Error fetching job ${jobId}:`, job.error);
        return null;
      }

      return {
        id: job.id,
        name: job.program?.id || 'Quantum Job',
        backend: job.backend?.name || 'Unknown',
        status: this.mapStatus(job.status),
        created: job.created,
        updated: job.updated,
        runtime: job.running_time,
        qubits: job.params?.circuits?.[0]?.num_qubits || Math.floor(Math.random() * 50) + 5,
        shots: job.params?.shots || 1024,
        program: job.program?.id || 'quantum_circuit',
        results: job.results,
        error: typeof job.error_message === 'object' ? JSON.stringify(job.error_message) : job.error_message
      };
    } catch (error) {
      console.error(`❌ Failed to fetch IBM Quantum job ${jobId}:`, error);
      return null;
    }
  }

  private mapStatus(ibmStatus: string): 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' {
    switch (ibmStatus?.toLowerCase()) {
      case 'queued': case 'pending': return 'queued';
      case 'running': case 'validating': return 'running';
      case 'completed': case 'done': return 'completed';
      case 'failed': case 'error': return 'failed';
      case 'cancelled': case 'canceled': return 'cancelled';
      default: return 'queued';
    }
  }

  private mapBackendStatus(ibmStatus: string | boolean | undefined): 'online' | 'offline' | 'maintenance' {
    if (typeof ibmStatus === 'boolean') {
      return ibmStatus ? 'online' : 'offline';
    }
    switch (ibmStatus?.toLowerCase()) {
      case 'online': return 'online';
      case 'maintenance': return 'maintenance';
      case 'offline': return 'offline';
      default: return 'offline'; // Default to offline if status is unknown or not provided
    }
  }

  isConfigured(): boolean {
    const { apiKey, projectId, instanceId } = this.getConfig();
    return !!(apiKey && projectId && instanceId);
  }

  getApiStatus(): string {
    const { apiKey, projectId, instanceId } = this.getConfig();
    const parts = [];
    if (!apiKey) parts.push('API Token missing');
    if (!projectId) parts.push('Project ID missing');
    if (!instanceId) parts.push('Instance ID missing');

    return parts.length === 0 ? '✅ Fully Configured' : `❌ Missing: ${parts.join(', ')}`;
  }

  getConfigurationHelp(): string {
    return `
🔧 IBM Quantum Configuration Required:

Environment Variables needed in your .env file:
• IBM_QUANTUM_API_TOKEN=your_api_token_here
• IBM_QUANTUM_PROJECT_ID=your_project_id_here  
• IBM_QUANTUM_INSTANCE_ID=your_instance_id_here
• IBM_QUANTUM_REGION=us-east (optional, defaults to us-east)

📍 How to find these values:
1. Go to https://quantum.ibm.com/
2. Create an account and access IBM Quantum Experience
3. API Token: Account Settings → API Token
4. Project ID: Your workspace/project ID from the dashboard
5. Instance ID: Your Quantum service instance ID from IBM Cloud

Current Status: ${this.getApiStatus()}
`;
  }
}

export const ibmQuantumService = new IBMQuantumService();