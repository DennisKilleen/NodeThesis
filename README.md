<snippet>
  <content>
# Node Socket Performance

This project is my fourth year Thesis. This project is to test the performance of node.js and socket.io. The files provided are how i tested the performance. I used webgl for the graphics to  

## Installation

Install MongoDB:  
For Windows:  
	Download the zip @ https://www.mongodb.org/downloads,  
For Ubuntu:  
	Follow the commands below:
```
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install mongodb-org
```
Install Node.js:  
For Windows:   
	Go to https://nodejs.org/download/ and download the .msi installer and install.  
For Ubuntu:  
	Install node
```
sudo apt-get install g++ curl libssl-dev apache2-utils git-core python-software-properties
sudo apt-add-repository ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install nodejs
```
	Make NPM global installs possible
```
npm config set prefix ~/.npm
echo 'export PATH=$HOME/.npm/bin:$PATH' >> ~/.bashrc 
. ~/.bashrc
```

These steps I followed by referencing https://github.com/rodrigopolo/node-mongo-demo/tree/master/install_instructions
## Usage

For Windows:  
cd to the mongo/bin directory:  
Run the command  
```
mongod --dbpath C:/Path/to/the/DB/directory/in/the/project 
``` 
Open another command prompt,  
cd to the server directory and run the command  
```
node app.js
```
For Ubuntu:  
cd to the server directory and run the command  
```
node app.js
```

On both:   
1.Open your browser(Preferably chrome) and redirect to 'localhost:8080' on two tabs,  
2.Enter the name you want for your session in the textbox provided,  
3.Click either button on both tabs e.g. 1 Host and 1 Responder should be open with the host opening first,  
4.Click either Single / Continuous,  
5. If you wish to view the other Single / Continuous functionality, refresh the Host THEN the Responder and click the other button,  

## Contributing

Please dont contribute as this is for my Thesis and must be all my own work.

## ISO
Currently I am creating a customized Ubuntu installer.  
I will link it here so that all you have to do is use a vm to view the project in action.  
https://www.dropbox.com/s/lap4ktrpsnowmcs/livecd.iso?dl=0  
This has all the software pre installed.  
Simply 
```
cd /thesis/NodeThesis/server
node app.js
```
Open the browser and off to local host:8080 with you!!
## License

No license at all.  
If you have any questions email me at dennis_killeen@hotmail.com
</content>
</snippet>
