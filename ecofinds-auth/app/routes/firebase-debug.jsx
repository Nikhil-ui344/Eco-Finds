import { useState, useEffect } from 'react';
import { runFirebaseDiagnostic } from '../lib/firebaseDiagnostic';
import { checkFirebaseHealth } from '../lib/firebaseErrorHandler';

export default function FirebaseDebugPage() {
  const [diagnosticResults, setDiagnosticResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [healthCheck, setHealthCheck] = useState(null);

  useEffect(() => {
    // Auto-run diagnostic on page load
    runDiagnostic();
  }, []);

  const runDiagnostic = async () => {
    setIsRunning(true);
    try {
      const results = await runFirebaseDiagnostic();
      setDiagnosticResults(results);
      
      const health = await checkFirebaseHealth();
      setHealthCheck(health);
    } catch (error) {
      console.error('Diagnostic failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'timeout': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'failed': return '❌';
      case 'timeout': return '⚠️';
      default: return '❓';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Firebase Debug Console</h1>
        
        <div className="mb-6">
          <button
            onClick={runDiagnostic}
            disabled={isRunning}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
          >
            {isRunning ? 'Running Diagnostic...' : 'Run Diagnostic'}
          </button>
        </div>

        {diagnosticResults && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Diagnostic Results</h2>
              
              {Object.entries(diagnosticResults).map(([test, result]) => (
                <div key={test} className="mb-4 p-3 border border-gray-200 rounded">
                  <div className="flex items-center mb-2">
                    <span className="mr-2">{getStatusIcon(result?.status)}</span>
                    <span className="font-medium capitalize">{test.replace(/([A-Z])/g, ' $1')}</span>
                    <span className={`ml-2 ${getStatusColor(result?.status)}`}>
                      {result?.status || 'unknown'}
                    </span>
                  </div>
                  
                  {result?.error && (
                    <div className="text-red-600 text-sm mb-2">
                      Error: {result.error}
                    </div>
                  )}
                  
                  {result && typeof result === 'object' && (
                    <div className="text-sm text-gray-600">
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(
                          Object.fromEntries(
                            Object.entries(result).filter(([key]) => 
                              !['status', 'error'].includes(key)
                            )
                          ), 
                          null, 
                          2
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {healthCheck && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Health Check</h2>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(healthCheck, null, 2)}
                </pre>
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
              <ul className="list-disc list-inside space-y-2 text-sm">
                {diagnosticResults.initialization?.status !== 'success' && (
                  <li>Check Firebase configuration in .env file</li>
                )}
                {diagnosticResults.firestoreRead?.code === 'permission-denied' && (
                  <>
                    <li>Check Firestore security rules</li>
                    <li>Ensure user is authenticated for protected operations</li>
                  </>
                )}
                {diagnosticResults.networkConnectivity?.status !== 'success' && (
                  <>
                    <li>Check internet connection</li>
                    <li>Check if firewall is blocking Firebase domains</li>
                  </>
                )}
                <li>If you see repeated 400 errors, try clearing browser cache and cookies</li>
                <li>Check Firebase console for any service outages</li>
              </ul>
            </div>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Current Environment Variables:</h3>
          <div className="text-sm space-y-1">
            <div>API Key: {import.meta.env.VITE_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing'}</div>
            <div>Auth Domain: {import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '✗ Missing'}</div>
            <div>Project ID: {import.meta.env.VITE_FIREBASE_PROJECT_ID || '✗ Missing'}</div>
            <div>Storage Bucket: {import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '✗ Missing'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
