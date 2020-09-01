const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  name: state => state.user.name,
  size: state => state.app.size,
  permission_routes: state => state.permission.routes,
  roles: state => state.user.roles,
  connectStatus: state => state.socket.isSuccessConnect,
  socketStatus: state => state.socket.socketInstance
}
export default getters
