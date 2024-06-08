import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  type HealthIndicatorResult,
} from '@nestjs/terminus';

@Injectable()
export class ServiceHealthIndicator extends HealthIndicator {
  constructor() {
    super();
  }

  async isHealthy(eventName: string): Promise<HealthIndicatorResult> {
    try {
      return {
        [eventName]: {
          status: 'down',
        },
      };
    } catch (error) {
      throw new HealthCheckError(`${eventName} failed`, {
        [eventName]: error,
      });
    }
  }
}
