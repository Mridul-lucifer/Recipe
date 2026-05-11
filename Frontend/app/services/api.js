const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
console.log("API Base URL:", BASE_URL);
export const getSuggestions = async (data) => {
  const response = await fetch(`${BASE_URL}/api/suggestions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getFullRecipe = async (dishTitle) => {
  const response = await fetch(`${BASE_URL}/api/recipe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dishTitle }),
  });
  return response.json();
};