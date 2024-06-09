import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RoleType } from '../../constants';
import { IUser } from '../../interfaces/IUser';
import { ApiConfigService } from '../../shared/services/api-config.service';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private configService: ApiConfigService,
	) {}

	validate(token): IUser {
		try {
			const decoded = this.jwtService.verify(token, {
				algorithms: ['RS256'],
				publicKey: this.configService.authConfig.publicKey,
			});

			return {
				clientId: decoded.applicationId,
				email: decoded.email,
				id: decoded.jid,
				role: decoded.roles[0],
			};
		} catch (error) {
			throw new UnauthorizedException('Failed to verify token');
		}
	}

	validateInternal(secret: string, clientId: string): IUser {
		// TODO: POPULATE EMAIL and ID LATER
		if (this.configService.authConfig.internalAuthSecret === secret) {
			return {
				clientId: clientId,
				email: '',
				id: '',
				role: RoleType.ADMIN,
			};
		}

		throw new UnauthorizedException('Failed to verify secret');
	}
}
