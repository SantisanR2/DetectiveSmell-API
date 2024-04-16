import { Module } from '@nestjs/common';
import { AnalizeController } from './analize.controller';

@Module({
  controllers: [AnalizeController],
  providers: []
})
export class AnalizeModule {}
