export const fetchAPTData = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/apt-groups'); // Replace with your backend URL
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching APT data:', error);
    return [];
  }
};
