import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IncomingMessage } from 'http';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<IncomingMessage>();
    const providedKey = request.headers['x-api-key'];
    const expectedKey = this.configService.get<string>('apiKey');

    if (!expectedKey) {
      throw new UnauthorizedException('API_KEY no configurada');
    }

    if (providedKey !== expectedKey) {
      throw new UnauthorizedException('API key inválida');
    }

    return true;
  }
}
