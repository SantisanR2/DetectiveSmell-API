import { Module } from '@nestjs/common';
import { AnalizeModule } from './analize/analize.module';

@Module({
  imports: [AnalizeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
