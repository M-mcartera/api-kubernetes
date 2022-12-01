import { logger } from '../../../ship/logger';

export default class UsersService {
  constructor({ serverSettings, KeycloakService, userIdentity }) {
    this.userIdentity = userIdentity;
    this.serverSettings = serverSettings;
    this.keycloakService = KeycloakService;
  }

  async listUsers() {
    try {
      await this.keycloakService.authenticateAdmin();
      const usersAndRoles = await this.keycloakService.findUsersAndRoles();
      return { success: true, users: usersAndRoles };
    } catch (err) {
      return { success: false, users: [] };
    }
  }

  async getUser(username) {
    try {
      await this.keycloakService.authenticateAdmin();
      const user = await this.keycloakService.findUser(username);
      return { success: true, user };
    } catch (err) {
      logger.debug('### GET KEYCLOAK USER', err);
      return { success: false, msg: err.message };
    }
  }

  async listRoles() {
    try {
      await this.keycloakService.authenticateAdmin();
      const roles = await this.keycloakService.findRoles();
      return { success: true, roles };
    } catch (err) {
      return { success: false, msg: err.message };
    }
  }

  async updateUser(username, payload) {
    try {
      await this.keycloakService.authenticateAdmin();
      const { success: updateUserResponse } =
        await this.keycloakService.updateUser(username, payload);

      if (!updateUserResponse) {
        return { success: false, msg: 'Failed to update user' };
      }

      const user = await this.keycloakService.findUser(username);
      return { success: true, user };
    } catch (err) {
      return { success: false, msg: err.message };
    }
  }

  async deleteUser(username) {
    try {
      await this.keycloakService.authenticateAdmin();
      await this.keycloakService.deleteUser(username);
      return { success: true };
    } catch (err) {
      return { success: false, msg: err.message };
    }
  }
}
