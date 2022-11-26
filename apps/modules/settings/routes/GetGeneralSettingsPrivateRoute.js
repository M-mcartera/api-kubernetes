import PrivateRoute from '../../../ship/routes/PrivateRoute';

export default new PrivateRoute({
    url: '/settings',
    method: 'get',
    permission: 'stt_r',
    controller: 'GetGeneralSettingsPrivateController',
});
