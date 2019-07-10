import Axios from "axios";

async function getSkills(){
	let result = await Axios.get("http://vannylen.eu/exec-handler/portfolio/skills");
	console.log(result);
}