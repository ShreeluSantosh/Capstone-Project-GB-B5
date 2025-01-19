import axios from 'axios';

const VIRUSTOTAL_API_URL = 'https://www.virustotal.com/api/v3';
const CIRCL_CVE_API_URL = 'https://cve.circl.lu/api/cve'; // CIRCL CVE API Base URL
const PROXY_API_URL = 'http://localhost:5000/api/cve';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

// Utility function to validate if the input is an IP address
const isIPAddress = (input) => {
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9][0-9]?)\.(25[0-5]|2[0-4][0-9][0-9]?)\.(25[0-5]|2[0-4][0-9][0-9]?)$/;
  return ipRegex.test(input);
};

// Fetch CVE data for domains
export const fetchCVEData = async (cveId) => {
  try {
    const response = await axios.get(`${CORS_PROXY}${CIRCL_CVE_API_URL}/${cveId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching CVE data:", error.message);
    throw error;
  }
};

// Fetch IoC data for domains
export const fetchIoCData = async (domain) => {
  try {
    console.log(`Fetching IoC data for domain: ${domain}`);
    const response = await axios.get(`${VIRUSTOTAL_API_URL}/domains/${domain}`, {
      headers: {
        "x-apikey": process.env.REACT_APP_VIRUSTOTAL_API_KEY,
      },
    });
    return response.data; // Axios automatically parses the JSON response
  } catch (error) {
    console.error("Error fetching IoC data:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch data for IP addresses
export const fetchIPData = async (ipAddress) => {
  try {
    console.log(`Fetching IP data for address: ${ipAddress}`);
    const response = await axios.get(`${VIRUSTOTAL_API_URL}/ip_addresses/${ipAddress}`, {
      headers: {
        "x-apikey": process.env.REACT_APP_VIRUSTOTAL_API_KEY,
      },
    });
    return response.data; // Axios automatically parses the JSON response
  } catch (error) {
    console.error("Error fetching IP data:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch data based on input type
export const fetchDataBasedOnInput = async (input) => {
  try {
    if (input.startsWith("CVE-")) {
      console.log(`Detected input as CVE ID: ${input}`);
      return await fetchCVEData(input); // Call fetchCVEData for CVE IDs
    } else if (isIPAddress(input)) {
      console.log(`Detected input as IP address: ${input}`);
      return await fetchIPData(input); // Call fetchIPData for IP addresses
    } else {
      console.log(`Detected input as domain: ${input}`);
      return await fetchIoCData(input); // Call fetchIoCData for domains
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
