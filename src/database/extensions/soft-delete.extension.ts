// src/prisma/extensions/soft-delete.extension.ts

import { Prisma } from 'src/generated/prisma/client';

export const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',

  query: {
    $allModels: {
      async findMany({ args, query }) {
        if ((args as any).withDeleted) {
          // when need to get deleted data
          delete (args as any).withDeleted;
          return query(args); // 🚀 skip filter
        }

        args.where = {
          ...(args.where ?? {}),
          deletedAt: null,
        };

        return query(args);
      },

      async findFirst({ args, query }) {
        args.where = {
          ...(args.where ?? {}),
          deletedAt: null,
        };

        return query(args);
      },
      // এটা ❌ risky Prisma findUnique strict
      // async findUnique({ args, query }) {
      //   args.where = {
      //     ...(args.where ?? {}),
      //     deletedAt: null,
      //   };

      //   return query(args);
      // },

      async count({ args, query }) {
        args.where = {
          ...(args.where ?? {}),
          deletedAt: null,
        };

        return query(args);
      },
    },
  },
});
