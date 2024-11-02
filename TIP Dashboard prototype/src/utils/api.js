// src/utils/api.js
import axios from 'axios';

const VIRUSTOTAL_API_URL = 'https://www.virustotal.com/api/v3';
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
const NVD_API_URL = 'https://services.nvd.nist.gov/rest/json/cves/2.0';

export const fetchCVEData = async (cveId) => {
  try {
    const response = await axios.get(`${CORS_PROXY}${NVD_API_URL}?cveId=${cveId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching CVE data:", error.message);
    throw error;
  }
};

export const fetchIoCData = async (domain) => {
  try {
    const response = await axios.get(`${CORS_PROXY}${VIRUSTOTAL_API_URL}/domains/${domain}`, {
      headers: {
        "x-apikey": process.env.REACT_APP_VIRUSTOTAL_API_KEY,
      },
    });
    return response.data; // Axios automatically parses the JSON response
  } catch (error) {
    console.error("Error fetching IoC data:", error.response?.data || error.message);
    throw error; // Re-throw for handling in the calling function
  }
};
