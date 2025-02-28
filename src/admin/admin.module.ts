import { Module } from '@nestjs/common';
import { GroupPolicyRepository } from 'src/casl/repositories/group-policy.repository';
import { GroupToPolicyRepository } from 'src/casl/repositories/group-to-policy.repository';
import { PolicyRepository } from 'src/casl/repositories/policy.repository';
import { UserToGroupPolicyRepository } from 'src/casl/repositories/user-to-group-policy.repository';
import { AdminCaslService } from 'src/casl/services/admin.casl.service';
import { CommonCaslService } from 'src/casl/services/common.casl.service';
import { TypeOrmCustomModule } from 'src/common/modules/typeorm-custom.module';
import { UserRepository } from 'src/users/repositoties/user.repository';
import { UtilsModule } from 'src/utils/utils.module';
import { ManageAdminController } from './controllers/manage.admin.controller';
import { ProfileAdminController } from './controllers/profile.admin.controller';
import { AdminRepository } from './repositoires/admin.repository';
import { ManageAdminService } from './services/manage.admin.service';
import { ProfileAdminService } from './services/profile.admin.service';

@Module({
  imports: [
    TypeOrmCustomModule.forFeature([
      AdminRepository,
      UserRepository,
      GroupPolicyRepository,
      UserToGroupPolicyRepository,
      PolicyRepository,
      GroupToPolicyRepository,
    ]),
    UtilsModule,
  ],
  controllers: [ManageAdminController, ProfileAdminController],
  providers: [
    ManageAdminService,
    ProfileAdminService,
    AdminCaslService,
    CommonCaslService,
  ],
  exports: [ManageAdminService],
})
export class AdminModule {}
