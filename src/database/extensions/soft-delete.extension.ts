// src/prisma/extensions/soft-delete.extension.ts

import { Prisma } from 'src/generated/prisma/client';

export const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',

  query: {
    $allModels: {
      async findMany({ args, query }) {
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

      async findUnique({ args, query }) {
        args.where = {
          ...(args.where ?? {}),
          deletedAt: null,
        };

        return query(args);
      },

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
