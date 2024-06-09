import {
	Injectable,
	type CallHandler,
	type ExecutionContext,
	type NestInterceptor,
} from '@nestjs/common';

import { IUser } from '../interfaces/IUser';
import { ContextProvider } from '../providers';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest();

		const user = <IUser>request.user;
		ContextProvider.setAuthUser(user);

		return next.handle();
	}
}
