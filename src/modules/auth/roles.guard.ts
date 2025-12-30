import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/modules/user/user.types';
import { ROLES_KEY } from './roles.decorator';
//$ read then learn how to work Full document and example
//$ https://www.notion.so/sampod/guard-ts-2bf7a1bce8f5803db2e4d6ee21cf17bf?source=copy_link

@Injectable() // এই ক্লাসটাকে NestJS DI (Dependency Injection) system এর জন্য injectable করা
export class RolesGuard implements CanActivate {
  // Reflector দিয়ে decorator-এর metadata পড়বো
  constructor(private reflector: Reflector) {}

  // প্রতিটা request আসলে এই method call হয়
  canActivate(context: ExecutionContext): boolean {
    // Controller বা Method এ দেওয়া @Roles() decorator থেকে role list বের করা
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY, // metadata key ('roles')
      [
        context.getHandler(), //serial 1 তারপর Method-level role (override করবে) | এটা আগে হবে
        context.getClass(), //serial 2 আগে Controller-level role চেক করবে
      ],
    );

    // যদি কোথাও @Roles() না থাকে → public API → allow
    if (!requiredRoles) {
      return true;
    }

    // JWT/Auth Guard থেকে request এর সাথে attach করা user বের করা
    const { user } = context.switchToHttp().getRequest();

    // user.role কি requiredRoles এর মধ্যে আছে কিনা চেক
    // থাকলে true (allow), না থাকলে false (403)
    return requiredRoles.includes(user.role);
  }
}
