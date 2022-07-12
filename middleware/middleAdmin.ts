import * as User from "../model/User"

export async function CheckReceiver(req, res, next) {
    const user: any = await User.checkExistingUser(req.user.emailuser);
    if (user.email === req.user.emailuser && user.ruolo == 1) {
      next();
    } else {
      res.sendStatus(404);
    }
  }