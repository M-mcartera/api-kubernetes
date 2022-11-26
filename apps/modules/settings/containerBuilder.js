export default ({ DbRepositoryBuilder, serverSettings }) => {
    return {
        settingsRepository: DbRepositoryBuilder('settings'),
    };
};
