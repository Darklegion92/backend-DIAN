import { Module } from '@nestjs/common';
import { TfhkaController } from './presentation/controllers/tfhka.controller';

@Module({
  imports: [],
  controllers: [TfhkaController],
  providers: [],
})
export class TfhkaModule {} 