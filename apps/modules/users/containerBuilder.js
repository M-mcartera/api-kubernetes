export default ({ DbRepositoryBuilder, serverSettings }) => {
    return {
        usersRepository: DbRepositoryBuilder('users')
    };
};
