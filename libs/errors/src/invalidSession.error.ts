import { InternalServerErrorException } from '@nestjs/common';

export class InvalidSessionException extends InternalServerErrorException {
  constructor(message: string) {
    super(message);
  }
}
