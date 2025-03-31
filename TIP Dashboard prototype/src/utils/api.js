import axios from 'axios';

const VIRUSTOTAL_DOMAIN_API_URL = 'https://www.virustotal.com/api/v3/domains';
const VIRUSTOTAL_IP_API_URL = 'https://www.virustotal.com/api/v3/ip_addresses';
const CIRCL_CVE_API_URL = 'https://cve.circl.lu/api/cve'; // CIRCL CVE API Base URL
const PROXY_API_URL = 'http://localhost:5000/api/cve';
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

const isValidDomain = (input) => {
  // Remove protocol if present
  const cleanedInput = input.replace(/^(https?:\/\/)/, '');

  // Domain validation regex
  const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,}$/;
  
  return domainRegex.test(cleanedInput);
};


// Fetch CVE data
export const fetchCVEData = async (cveId) => {
  try {
    const response = await axios.get(`${CORS_PROXY}${CIRCL_CVE_API_URL}/${cveId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching CVE data:", error.message);
    throw error;
  }
};

// Fetch data for domains
export const fetchDomainData = async (domain) => {
  try {
    console.log(`Fetching lookup data for domain: ${domain}`);
    const response = await axios.get(`${CORS_PROXY}${VIRUSTOTAL_DOMAIN_API_URL}/${domain}`, {
      headers: {
        "x-apikey": process.env.REACT_APP_VIRUSTOTAL_API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Domain data:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch data for IP addresses
export const fetchIPData = async (ipAddress) => {
  try {
    console.log(`Fetching lookup data for IP address: ${ipAddress}`);
    const response = await axios.get(`${CORS_PROXY}${VIRUSTOTAL_IP_API_URL}/${ipAddress}`, {
      headers: {
        "x-apikey": process.env.REACT_APP_VIRUSTOTAL_API_KEY,
      },
    });
    return response.data;
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
    } else if (isValidDomain(input)){
      console.log(`Detected input as domain: ${input}`);
      return await fetchDomainData(input); // Call fetchDomainData for domains
    } else {
      console.log(`Detected input as IP address: ${input}`); // Call fetchIPData for IP address
      return await fetchIPData(input);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
