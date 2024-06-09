import { RoleType } from '../constants';

export interface IUser {
	id: string;
	email: string;
	clientId: string;
	role: RoleType;
}
