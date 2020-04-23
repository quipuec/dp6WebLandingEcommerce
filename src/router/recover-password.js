const route = {
	name: 'restore-password',
	path: '/nueva-contrasena/:token',
	component: () => import('@/pages/page-recover-password.vue'),
};

export default route;
