// Role-Based Access Control (RBAC) middleware for admin-protected routes
export default function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Доступ лише для адміністраторів' });
  }
  next();
}
