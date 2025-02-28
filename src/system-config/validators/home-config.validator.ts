import { plainToInstance } from 'class-transformer';
import {
  registerDecorator,
  validateOrReject,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import {
  HomeSection,
  HomeSectionBanner,
  HomeSectionNormalService,
} from '../dto/common/home-config.common.dto';
import { HomeSectionType } from '../enums/home-config.enum';

export function IsValidHomeConfig(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidHomeConfig',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      async: true,
      validator: {
        async validate(value: HomeSection[], args: ValidationArguments) {
          if (!value?.length) return false;

          try {
            await Promise.all(
              value.map(async (homeSection) => {
                switch (homeSection.type) {
                  case HomeSectionType.BANNER:
                    return validateOrReject(
                      plainToInstance(HomeSectionBanner, homeSection),
                    );
                  case HomeSectionType.NORMAL_SERVICE:
                    return validateOrReject(
                      plainToInstance(HomeSectionNormalService, homeSection),
                    );
                  default:
                    throw new Error('Home section type is invalid');
                }
              }),
            );
          } catch (error) {
            console.log('error', error);
            return false;
          }

          return true;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} with value ${args?.value} is invalid HomeConfig`;
        },
      },
    });
  };
}
