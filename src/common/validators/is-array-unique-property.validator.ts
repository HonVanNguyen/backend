import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * @param properties List object's property to check unique
 */
export function IsArrayObjUniqueProperty(
  properties: string[],
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsArrayObjUniquePropertyValidator',
      target: object.constructor,
      propertyName: propertyName,
      constraints: properties,
      options: validationOptions,
      validator: {
        validate(
          data: Record<any, any>[],
          validationArguments?: ValidationArguments,
        ): boolean {
          const constraints = validationArguments?.constraints as string[];

          if (typeof data !== 'object')
            throw new Error(
              'IsArrayObjUniquePropertyValidator must be used on array',
            );

          if (!constraints?.length)
            throw new Error('Property to check unique must be supply');

          for (const constraint of constraints) {
            const list: any[] = [];

            for (const item of data) {
              const value = item[constraint];

              if (!value) {
                console.log(`wrong properties on IsArrayObjUniqueProperty`);
              }

              if (list.includes(item[constraint])) return false;

              list.push(item[constraint]);
            }
          }

          return true;
        },

        defaultMessage(validationArguments?: ValidationArguments): string {
          const property = validationArguments?.property || '<unknown>';
          const constraints = validationArguments?.constraints;

          return `Duplicate ${constraints[0]} on ${property}`;
        },
      },
    });
  };
}
