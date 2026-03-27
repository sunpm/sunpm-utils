# sunpm-utils 协作约定

本文件用于沉淀本仓库已经确认过的工程约定，减少重复检索，提高后续协作效率。

## 仓库结构

- 本仓库采用按能力分包的目录结构，源码位于 `packages/*/index.ts`
- 当前模块包括：`array`、`date`、`is`、`number`、`object`、`promise`、`string`、`url`
- 聚合导出入口位于 `packages/core/index.ts`
- 构建入口为 `packages/core/index.ts`，由 `tsup.config.ts` 打包到 `dist/`

## 导出约定

- 新增公共工具函数时，优先放入最贴近语义的 `packages/<module>/index.ts`
- 如果对应模块已经在 `packages/core/index.ts` 中被 `export *`，通常不需要额外补总入口
- 语义归属建议：
  - 以字符串清洗、解析、转换为主的函数，放 `packages/string/index.ts`
  - 以数字计算、格式化、范围控制为主的函数，放 `packages/number/index.ts`
  - 以数组增删改查、分组、重排为主的函数，放 `packages/array/index.ts`
  - 以对象读取、合并、拷贝、键值处理为主的函数，放 `packages/object/index.ts`

## 测试约定

- 测试框架为 Vitest
- 每个模块的测试文件与实现文件同级，命名为 `packages/<module>/index.test.ts`
- 新增函数时，应优先在对应模块测试文件内补充用例，而不是新建零散测试文件
- 常规至少覆盖：
  - 基本输入
  - 空值或无效值
  - 边界值
  - 自定义参数分支

## 文档与注释风格

- 使用 TypeScript
- 使用中文 JSDoc
- 新增公共方法时应补齐：
  - 简短但明确的函数说明
  - `@param`
  - `@returns`
  - `@group`
  - 至少一组 `@example`
- 注释风格应与现有模块保持一致，偏简洁、说明导向，不写空泛注释

## 模块风格

- 优先编写纯函数，避免修改传入参数
- 返回值应尽量稳定、可预测，优先做无效态兜底
- 对后端输入、字符串解析、类型边界要偏保守处理，避免把脏数据直接透传给调用方
- 非必要不要引入新依赖
- 保持实现简洁，优先沿用仓库现有写法和命名风格

## 构建与发布

- 包管理器使用 `pnpm`
- 常用命令：
  - `pnpm test`
  - `pnpm typecheck`
  - `pnpm lint`
  - `pnpm build`
- 发包前默认顺序：
  1. 实现功能并补测试
  2. 运行 `pnpm test`、`pnpm typecheck`，必要时运行 `pnpm lint`、`pnpm build`
  3. 提交功能变更
  4. 根据变更级别执行 `npm version patch|minor|major`
  5. `git push origin main`
  6. `git push origin --tags`
  7. `npm publish --access public`
- 若 npm 开启 2FA，发布时需要额外传入 `--otp=<code>`

## 版本策略

- 新增向后兼容的公共 API，默认使用 `minor`
- 修复已有行为且不引入新 API，默认使用 `patch`
- 存在破坏性变更时，使用 `major`

## 已确认的当前仓库事实

- npm 包名：`@pmun/utils`
- 当前构建工具：`tsup`
- 当前测试框架：`vitest`
- 当前发布脚本中已经存在 `publish:only` 和 `release:*`

## 检索策略

- 有本文件覆盖的信息时，后续任务不要再做整仓库的重复检索
- 但以下情况仍应做“最小必要确认”：
  - 要修改的模块或入口可能已经变化
  - 要发版、发包、打 tag
  - 用户明确提到“最新状态”或要求核对现状
  - 工作区可能有未提交改动，需要避免覆盖用户更改
- 推荐的最小确认方式：
  - 看 `git status --short --branch`
  - 看目标文件是否存在及当前位置
  - 看 `package.json` 中脚本是否变化
- 结论：不是以后完全不要检索，而是避免重复全量检索，只做和当前任务直接相关的最小核对
