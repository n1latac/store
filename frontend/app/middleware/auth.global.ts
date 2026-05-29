export default defineNuxtRouteMiddleware((to) => {
  const { isAuthenticated } = useAuth();

  // If the route is an admin page, not the login page, and user is not authenticated:
  if (to.path.startsWith('/admin') && to.path !== '/admin/login' && !isAuthenticated.value) {
    return navigateTo('/admin/login');
  }
});
