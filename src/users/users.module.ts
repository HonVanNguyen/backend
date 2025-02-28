import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'src/common/modules/typeorm-custom.module';
import { UserRepository } from './repositoties/user.repository';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmCustomModule.forFeature([UserRepository])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
