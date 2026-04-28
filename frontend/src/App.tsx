import { useState } from 'react';
import axios from 'axios';
import { AnalysisResult, FormData } from './types';
import InputForm from './components/InputForm';
import LoadingTerminal from './components/LoadingTerminal';
import ResultsPage from './components/ResultsPage';

type AppState = 'input' | 'loading' | 'results';

function App() {
  const [appState, setAppState] = useState<AppState>('input');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    setError(null);
    setAppState('loading');
    try {
      const payload: Record<string, string> = {
        githubUsername: data.githubUsername,
        leetcodeUsername: data.leetcodeUsername,
        mode: data.mode,
      };
      if (data.mode === 'product') payload.tier = data.tier;

      const response = await axios.post<AnalysisResult>(
        'http://localhost:5000/api/analyze',
        payload,
        { timeout: 90000 }
      );
      setResult(response.data);
      setAppState('results');
    } catch (err) {
      let msg = 'Unknown error occurred';
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.error) msg = err.response.data.error;
        else if (err.response?.data?.message) msg = err.response.data.message;
        else if (err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED')
          msg = 'Cannot connect to backend. Is the server running on port 5000?';
        else if (err.code === 'ECONNABORTED') msg = 'Request timed out.';
        else msg = err.message;
      }
      setError(msg);
      setAppState('input');
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setAppState('input');
  };

  return (
    <>
      {appState === 'input' && <InputForm onSubmit={handleSubmit} error={error} />}
      {appState === 'loading' && <LoadingTerminal />}
      {appState === 'results' && result && <ResultsPage result={result} onReset={handleReset} />}
    </>
  );
}

export default App;
