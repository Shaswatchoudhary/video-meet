
const subscriptionMiddleware = (req, res, next) => {
  // Allow all users for now as per "free for everyone" design
  /*
  if (req.user.subscriptionStatus !== "active") {
    return res.status(403).json({ message: "Subscription required" });
  }
  */
  next();
}

export default subscriptionMiddleware;