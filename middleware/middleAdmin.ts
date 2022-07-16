import * as User from "../model/User";

/**
 * 
{
 "role": "2",
 "emailuser":"user@user.com",
 "budget": "100"
}
*/

export async function checkAdmin(req, res, next) {
  if (req.user.role === "2") {
    next();
  } else {
    res.sendStatus(401);
  }
}

export async function CheckReceiver(req, res, next) {
  const user: any = await User.checkExistingUser(req.user.emailuser);
  if (user.email === req.user.emailuser) {
    next();
  } else {
    res.sendStatus(404);
  }
}
