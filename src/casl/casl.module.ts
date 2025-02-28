import { Global, Module } from '@nestjs/common';
import { TypeOrmCustomModule } from 'src/common/modules/typeorm-custom.module';
import { UserRepository } from 'src/users/repositoties/user.repository';
import { CaslAbilityFactory } from './casl-ability.factory';
import { AdminCaslController } from './controllers/admin.casl.controller';
import { GroupPolicyRepository } from './repositories/group-policy.repository';
import { GroupToPolicyRepository } from './repositories/group-to-policy.repository';
import { PolicyRepository } from './repositories/policy.repository';
import { UserToGroupPolicyRepository } from './repositories/user-to-group-policy.repository';
import { AdminCaslService } from './services/admin.casl.service';
import { CommonCaslService } from './services/common.casl.service';
import { TaskCaslService } from './services/task.casl.service';
import { JwtCaslAdminStrategy } from './strategies/jwt-casl.admin.strategy';

@Global()
@Module({
  imports: [
    TypeOrmCustomModule.forFeature([
      UserRepository,
      GroupPolicyRepository,
      GroupToPolicyRepository,
      PolicyRepository,
      UserToGroupPolicyRepository,
      PolicyRepository,
    ]),
  ],
  controllers: [AdminCaslController],
  providers: [
    AdminCaslService,
    CommonCaslService,
    TaskCaslService,
    CaslAbilityFactory,
    JwtCaslAdminStrategy,
  ],
  exports: [CaslAbilityFactory],
})
export class CaslModule {}
