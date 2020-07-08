# Madmin: Application management tool

Madmin is an application that will make managing and deploying new web apps easier through a simple and intuitive web interface.


## Apps
Madmin apps are meant to solve a common issue. Multiple web apps hosted on the same server that all use ports 80 and/or 443. It's not really an issue if they're all static pages hosted via Apache or nginx but when some of them are written in Node.js, C, Golang etc... it becomes harder to assign those ports to all those programs. Madmin apps provide two solutions to this issue. For static file hosting you can use madmin to host those files on a separate domain name or subdomain. For most other apps you can use the proxy setting. Proxy apps will redirect all requests on the specified domain/subdomain to the specified IP address.

Examples are coming soon.

[comment]: <> (TODO: Provide examples.)


## Handlers
Handlers is JavaScript code that you can write in your browser and then trigger on the server by sending an http request to the specified url. This is great for making a placeholder API but more importantly you can use it for Continuous Deployment. Create a new post handler, write the code for updating your application, copy the path and create a webhook for your git repository.

Examples are coming soon.

[comment]: <> (TODO: Provide examples.)

## Scripts
Scripts are basically the same as handlers but instead of being triggered via http requests they can be triggered on madmin start, periodically or manually. 

Pro tip: Write the code for updating your application as a script and then fetch the script in the handler code. This way you can always manually trigger app updates.

Examples are coming soon.

[comment]: <> (TODO: Provide examples.)

## File Browser
File browser with a basic file editor and image viewer. Not finished yet.

[comment]: <> (TODO: Finish the file browser.)

---

## Building

Madmin consists of two parts. The client and the server. The client is a web interface written in Vue with TypeScript. The server is the api endpoint for the client and also for custom handlers and apps. It's also written in TypeScript. Once built you can run it from the server directory by running `npm run start` or you can package it into a binary using `npm run nexe`. Packaging it can be usefull if you want to separate your configuration from the source code and keep things tidy. If you do decide to package it you can run madmin by just executing the generated binary. The generated binary can be found inside the server/nexe directory. 

**WARNING** Packaging on arm devices can take a long time but only the first time. Nexe does not provide any arm based Node.js binaries so you will have to build it yourself. I built it on a Raspberry Pi 3 and the first time it take somewhere between 4-12 hours. But because nexe caches generated Node.js binaries inside ~/.nexe, subsequent builds take less then a minute.

### prerequisites
Make sure you have at least Node.js v12 installed and run ```npm install``` in both the `client` and `server` directory. 

### building

```bash
$ cd server			# Switch to the server directory
$ npm run build		# Transpile TypeScript into JavaScript (Generated output will be put inside the dist directory)
$ cd ../client		# Switch to the client directory
$ npm run build		# Build the client (Output will be put inside ../server/dist/public)

# OPTIONAL 
$ cd ../server		# Switch to the server directory
$ npm run nexe		# Package the application into a single binary
```

