
const subscriptionMiddleware = (req, res, next) => {
  if (req.user.subscriptionStatus !== "active") {
    return res.status(403).json({ message: "Subscription required" });
  }
  next();
}

export default subscriptionMiddleware;