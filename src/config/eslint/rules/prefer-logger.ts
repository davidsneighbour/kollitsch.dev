// src/config/eslint/rules/prefer-logger.ts
import type { Rule } from 'eslint';
// Use the AST node types only where helpful; avoid strict parameter typing to
// prevent version skew between @typescript-eslint and ESLint core.
import type { TSESTree } from '@typescript-eslint/types';

/**
 * Enforce using the project logger instead of console.*.
 * Flags direct and aliased console usage.
 */
type Options = [
  {
    allow?: string[];
    allowInFiles?: string[];
  }
];

const DEFAULT_BLOCKED = new Set(['log', 'info', 'debug', 'warn', 'error', 'trace']);

function isAllowedFile(filename: string | null, patterns: string[] | undefined): boolean {
  if (!filename || !patterns || patterns.length === 0) return false;
  return patterns.some((frag) => filename.includes(frag));
}

function getMemberPropName(node: TSESTree.MemberExpression): string | null {
  if (!node.computed && node.property.type === 'Identifier') return node.property.name;
  if (node.computed && node.property.type === 'Literal' && typeof node.property.value === 'string') {
    return node.property.value;
  }
  return null;
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow console.* in favor of the project logger',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: { type: 'array', items: { type: 'string' } },
          allowInFiles: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      preferLogger:
        'Use the project logger (createLogger(...).{{method}}) instead of console.{{method}}.',
      preferLoggerAlias:
        'Use the project logger (createLogger(...).{{method}}) instead of an alias to console.{{method}}.',
    },
  },

  create(context): Rule.RuleListener {
    // ESLint v9 exposes `context.filename`; v8 used getFilename()
    const filename =
      // @ts-expect-error - filename exists on newer ESLint
      (context as any).filename ??
      (typeof (context as any).getFilename === 'function' ? (context as any).getFilename() : null);

    const [{ allow = [], allowInFiles = [] } = {}] = context.options as Options;
    const allowed = new Set(allow);
    const blocked = new Set([...DEFAULT_BLOCKED].filter((m) => !allowed.has(m)));

    if (isAllowedFile(filename, allowInFiles)) {
      return {} as Rule.RuleListener;
    }

    // Track aliases to console methods
    const aliased: Map<string, string> = new Map();
    const isBlockedMethod = (method: string | null): method is string => Boolean(method && blocked.has(method));

    const listener: Rule.RuleListener = {
      VariableDeclarator(node: any) {
        try {
          // const log = console.log
          if (
            node.init &&
            node.id?.type === 'Identifier' &&
            node.init.type === 'MemberExpression' &&
            node.init.object?.type === 'Identifier' &&
            node.init.object.name === 'console'
          ) {
            const method = getMemberPropName(node.init as TSESTree.MemberExpression);
            if (isBlockedMethod(method)) aliased.set(node.id.name, method);
          }

          // const { log, error } = console
          if (
            node.init &&
            node.id?.type === 'ObjectPattern' &&
            node.init.type === 'Identifier' &&
            node.init.name === 'console'
          ) {
            for (const prop of node.id.properties ?? []) {
              if (prop.type !== 'Property') continue;
              if (prop.key.type !== 'Identifier') continue;
              const method = prop.key.name;
              if (!isBlockedMethod(method)) continue;

              let local = method;
              if (prop.value.type === 'Identifier') {
                local = prop.value.name;
              } else if (prop.value.type === 'AssignmentPattern' && prop.value.left.type === 'Identifier') {
                local = prop.value.left.name;
              }
              aliased.set(local, method);
            }
          }
        } catch {
          // never crash linting
        }
      },

      CallExpression(node: any) {
        const callee = node.callee;

        // console.method(...)
        if (
          callee?.type === 'MemberExpression' &&
          callee.object?.type === 'Identifier' &&
          callee.object.name === 'console'
        ) {
          const method = getMemberPropName(callee as TSESTree.MemberExpression);
          if (isBlockedMethod(method)) {
            context.report({
              node: (callee as TSESTree.MemberExpression).property,
              messageId: 'preferLogger',
              data: { method },
            });
          }
          return;
        }

        // alias(...)
        if (callee?.type === 'Identifier') {
          const method = aliased.get(callee.name) ?? null;
          if (isBlockedMethod(method)) {
            context.report({
              node: callee,
              messageId: 'preferLoggerAlias',
              data: { method },
            });
          }
        }
      },
    };

    return listener;
  },
};

export default rule;
