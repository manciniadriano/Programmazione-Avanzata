import * as User from "../model/User";

export async function checkAdmin(req, res, next) {
  const user: any = await User.checkExistingUser(req.user.email);
  if (user.email === req.user.email && user.ruolo === 2) {
    next();
  } else {
    res.sendStatus(401);
  }
}

export async function CheckReceiver(req, res, next) {
  const user: any = await User.checkExistingUser(req.user.emailuser);
  if (user.email === req.user.emailuser && user.ruolo == 1) {
    next();
  } else {
    res.sendStatus(404);
  }
}
