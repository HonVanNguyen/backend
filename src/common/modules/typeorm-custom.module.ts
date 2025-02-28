import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

@Module({})
export class TypeOrmCustomModule {
  static forFeature(
    repoClasses: { new (...params: any[]): any }[],
  ): DynamicModule {
    const providers = repoClasses.map<Provider>((repoClass) => {
      return {
        inject: [ModuleRef],
        provide: repoClass,
        async useFactory(moduleRef: ModuleRef) {
          let repo = moduleRef.get(repoClass, { strict: false });
          if (!repo) repo = await moduleRef.create(repoClass);

          return repo;
        },
      };
    });

    return {
      module: TypeOrmCustomModule,
      providers,
      exports: [...repoClasses],
    };
  }
}
