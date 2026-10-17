const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function getApiHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

export default getApiHealth;
