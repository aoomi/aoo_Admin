# 107 Admin CI 与异常处理复核

复核日期：2026-08-24

## 处理结果

- CI 包管理器统一为 `pnpm@11.19.0`，与 `package.json#packageManager`、`engines.pnpm` 和 `pnpm-lock.yaml` 对齐。
- CI 使用 `pnpm install --frozen-lockfile`，并以 pnpm 执行 audit、typecheck、lint、test、build。
- 二次审计发现的 14 个文件内吞异常均已处理（共 15 个空 `catch` 分支；`setClubStatus.vue` 含两个）。
- 新增统一异常出口 `src/utils/adminError.ts`：生成追踪号、记录安全诊断字段并显示用户可操作的失败状态。
- 诊断记录仅包含追踪号、固定上下文、异常类型、短错误码及 HTTP 状态；不记录请求体、响应体、请求头、URL、堆栈或异常消息，避免泄露令牌、账号及业务数据。
- 失败分支不再显示成功提示或关闭待编辑弹窗；查询和提交的 loading 状态仍可恢复，用户可重试。

## 验证

使用项目锁定的 Node.js `24.19.0`：

| 检查 | 结果 |
| --- | --- |
| `pnpm run lint` | 通过 |
| `pnpm run typecheck` | 通过 |
| `pnpm test` | 通过，5 个测试文件、15 个测试 |
| `pnpm run build:pro` | 通过 |

注：宿主默认 Node.js 为 20.10.0，无法运行当前 Vite/Rolldown；本次验证显式使用项目工具链 Node.js 24.19.0，与 CI 配置一致。
