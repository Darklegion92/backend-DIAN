import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsPasswordStrong(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPasswordStrong',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumbers = /\d/.test(value);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
          const isLongEnough = value.length >= 8;

          return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough;
        },
        defaultMessage(args: ValidationArguments) {
          return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial';
        },
      },
    });
  };
} 