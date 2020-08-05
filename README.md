# RulesView-Frontend
This is the repo for the front end of the RulesView app

# This is how the tool looks like
![Image](https://github.com/Dnshbbu/RulesView-Frontend/blob/master/SampleScreenshot/sampless.png?raw=true)

# Steps to reproduce the Frontend of RulesView
1. Clone the repository ``git clone https://github.com/Dnshbbu/RulesView-Frontend``
2. Run ``node -v`` and ``npm -v`` to check whether node.js and npm is installed. If not, download and install node.js and npm
3. Install all the dependencies by typing ``npm install``
4. Run the application ``ng serve``
5. Open the browser ``http://localhost:4200/`` to open the app


# After the Backend and Frontend is setup, you can start importing the Network Objects, TCP/UDP ports and Firewall policies in the below order
1. Create ``Groups`` in the left pane (Ex: 10.90.1.0/24- WebDMZ)
2. Upload Network Objects
3. Upload Port details- TCP, UDP
4. Upload firewall policies

# Technology stack
1. [Angular Framework](https://angular.io/)
2. [Neo4j graph database](https://neo4j.com/)
3. [Cytoscape.js](https://js.cytoscape.org/)



