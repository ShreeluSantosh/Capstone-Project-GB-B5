# Capstone-Project-GB-B5

## Tasks for Phase 1 - Review 2

1. [X] Build web dashboard
2. [X] Research on APT groups and build MongoDB threat repository
3. [X] Tweet collection 
4. [X] Dataset processing and sorting
5. [X] Model building and training

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
