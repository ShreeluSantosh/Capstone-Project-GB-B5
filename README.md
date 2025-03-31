# Capstone-Project-GB-B5

## Topic: TweetBeacon - A Secure AI Cyber Threat Intelligence Platform

TweetBeacon features a futuristic cybersecurity aesthetic, with a dark UI, neon highlights, and dynamic data visualizations. It provides an intuitive experience for security professionals to track cyber incidents via Twitter data.

<h2>How It Works</h2>
<ul>
  <li><strong>Data Collection:</strong> Fetches real-time cybersecurity-related tweets using Twitter’s API.</li>
  <li><strong>Threat Mapping:</strong> Uses geolocation and keyword analysis to display threats on an interactive map.</li>
  <li><strong>Feed Analysis:</strong> Aggregates security alerts, malware reports, and trending threats from cybersecurity researchers.</li>
  <li><strong>Filtering & Search:</strong> Users can filter by specific threat types, locations, or sources.</li>
</ul>

<h2>Use Cases</h2>
<ul>
  <li><strong>SOC Teams & Analysts:</strong> Monitor live threat intelligence feeds.</li>
  <li><strong>Incident Response:</strong> Quickly identify new vulnerabilities, malware campaigns, or attack trends.</li>
  <li><strong>Threat Hunting:</strong> Correlate Twitter reports with internal security alerts.</li>
  <li><strong>Cybersecurity Researchers:</strong> Stay updated on the latest attack vectors and exploits.</li>
</ul>

## Running the dashboard:

### Requirements:
1. Node.js
2. Git
3. VSCode, or any terminal from where you can run git and npm commands.

### Steps:

1. First install Node.js on your machine. Download it from official website: <a href="https://nodejs.org/en/learn/getting-started/how-to-install-nodejs">Download and Install Node.js</a>
2. Fork this repository and clone your fork to your machine with this git command:
```
git clone https://github.com/<your-github-username>/Capstone-Project-GB-B5.git
```
OR
Clone this repository to your machine with git command
```
git clone https://github.com/ShreeluSantosh/Capstone-Project-GB-B5.git
```
3. Navigate inside the project root, and to the directory "TIP Dashboard prototype" with this command: `cd "TIP Dashboard prototype"`
4. Install React with this command: `npm install react`
5. Then install two npm packages needed to get the dashboard's backend in proper working condition: `npm install axios papaparse`
6. Finally, start the dashboard with `npm start`

### Enabling Lookup

1. Go to `/TIP Dashboard prototype` directory. You'll find a `env.txt`.
2. Create a `.env` file inside `/TIP Dashboard prototype` directory
3. Copy and paste the contents of `env.txt` into `.env` file (You can do it in VS Code) and save the changes.
4. For temporary access to proxy via Heroku's CORS Anywhere, visit `https://cors-anywhere.herokuapp.com/corsdemo` and click on "Request temporary access to the demo server"
