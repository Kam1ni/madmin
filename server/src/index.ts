import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as http from "http";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
server.listen(3000, function(){
	console.log("server started");
});