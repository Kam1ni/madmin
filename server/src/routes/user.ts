import { Router } from "express";
import { User, IUser } from "../models/user";
import { HttpError } from "../classes/HttpError";

export const userRouter = Router();

userRouter.get("/", async (req, res, next)=>{
	res.json((await User.find()).map(u => u.getPublicJson()));
});

userRouter.all("/*", async function(req,res,next){
	let loggedInUser = <IUser>res.locals.user;
	if (!loggedInUser.isAdmin){
		return next(new HttpError("Access denied", 403));
	}
	next();
});

userRouter.post("/", async function(req,res,next){
	let user = new User();
	user.username = req.body.username;
	user.setPassword(req.body.password);
	user.isAdmin = req.body.isAdmin;
	try{
		await user.save();
		res.json(user);
	}catch(err){
		next(new HttpError(err.message));
	}
});

userRouter.all("/:id/*", async function(req,res,next){
	let user = await User.findById(req.params.id);
	if (!user){
		return next(new HttpError("User does not exist", 404));
	}
	res.locals.foundUser = user;
	next();
})

userRouter.put("/:id/edit", async function(req,res,next){
	let user:IUser = res.locals.foundUser;
	user.username = req.body.username;
	user.isAdmin = req.body.isAdmin;
	try{
		await user.save();
		res.json(user);
	}catch(err){
		next(new HttpError(err.message, 500));
	}
});

userRouter.put("/:id/change-password", async function(req,res,next){
	let user:IUser = res.locals.foundUser;
	if (user.id == res.locals.user.id){
		return next(new HttpError("You cannot change your own password with this route. User \"/auth/change-password\"", 403));
	}
	user.setPassword(req.body.password);
	try{
		await user.save();
		res.json(user);
	}catch(err){
		next(new HttpError(err.message, 500));
	}
});

userRouter.delete("/:id", async function(req,res,next){
	let user:IUser = res.locals.foundUser;
	if (user.id == res.locals.user.id){
		return next(new HttpError("You cannot delete your own account.", 403));
	}
	await user.remove();
	res.json({message:"success"});
});