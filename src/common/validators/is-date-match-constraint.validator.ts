import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { I18nPath } from '../../i18n/i18n.generated';

export type IsDateMatchConstraintParams = {
  validationOptions?: ValidationOptions;
  getDateFunc: () => Date;
  compareFunc: (propertyDate: Date, dateFromFuncGet: Date) => boolean;
};

export function IsDateMatchConstraint({
  compareFunc,
  getDateFunc,
  validationOptions,
}: IsDateMatchConstraintParams) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsDateMatchConstraint',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: Date, args: ValidationArguments) {
          const dateToCompare = getDateFunc();
          return compareFunc(value, dateToCompare);
        },
        defaultMessage(args: ValidationArguments): I18nPath | string {
          return 'common.validationError.date';
        },
      },
    });
  };
}
