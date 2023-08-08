export type ROLES = 'admin' | 'user';
export type PERMISSIONS_ACTION = {
  name: string;
  checked: boolean;
};
export type PERMISSION_RESOURCE = {
  name: string;
  actions: PERMISSIONS_ACTION[];
};
