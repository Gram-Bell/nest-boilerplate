import './boilerplate.polyfill';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

@Module({
	imports: [
		LoggerModule.forRoot({
			pinoHttp: {
				level: process.env.NODE_ENV !== 'PRODUCTION' ? 'debug' : 'info',
				transport:
					process.env.NODE_ENV !== 'production'
						? { target: 'pino-pretty' }
						: undefined,
			},
		}),
		PrometheusModule.register({
			path: '/metrics',
		}),
		AuthModule,
		UserModule,
		PostModule,
		ClsModule.forRoot({
			global: true,
			middleware: {
				mount: true,
			},
		}),
		ThrottlerModule.forRootAsync({
			imports: [SharedModule],
			useFactory: (configService: ApiConfigService) => ({
				throttlers: [configService.throttlerConfigs],
			}),
			inject: [ApiConfigService],
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		TypeOrmModule.forRootAsync({
			imports: [SharedModule],
			useFactory: (configService: ApiConfigService) =>
				configService.postgresConfig,
			inject: [ApiConfigService],
			dataSourceFactory: (options) => {
				if (!options) {
					throw new Error('Invalid options passed');
				}

				return Promise.resolve(
					addTransactionalDataSource(new DataSource(options)),
				);
			},
		}),
		HealthCheckerModule,
	],
	providers: [],
})
export class AppModule {}
