import { Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'src/common/modules/typeorm-custom.module';
import { FileRepository } from 'src/file/repositories/file.repository';
import { UtilsModule } from 'src/utils/utils.module';
import { ManageCustomerController } from './controllers/manage.customer.controller';
import { ProfileCustomerController } from './controllers/profile.customer.controller';
import { CustomerRepository } from './repositories/customer.repository';
import { ManageCustomerService } from './services/manage.customer.service';
import { ProfileCustomerService } from './services/profile.customer.service';

@Module({
  imports: [
    TypeOrmCustomModule.forFeature([CustomerRepository, FileRepository]),
    UtilsModule,
  ],
  controllers: [ManageCustomerController, ProfileCustomerController],
  providers: [ManageCustomerService, ProfileCustomerService],
})
export class CustomerModule {}
