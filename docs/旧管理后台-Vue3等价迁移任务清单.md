# 旧管理后台 Vue 3 等价迁移任务清单

## 迁移原则

- 保留当前 Vue 3 后台全部已有功能。
- FreeMarker/jQuery 页面不复制，等价重建为 Vue 3 + Element Plus。
- 查询、分页、新增、编辑、删除统一走公共配置页面。
- Java Controller 必须逐步改为 JSON API，页面不再依赖服务端 HTML。

## 第一批模块

后台管理员、角色权限、菜单权限、游戏类型、玩家档案、工会管理、赛事联盟、联系方式、竞技点日志、发牌控制、玩家输赢控制、大数据控制的 Vue 3 页面和 API 适配层已建立。

## 后端闭环标准

- 列表统一返回 `{ code, message, data: { records, total } }`。
- 新增、编辑、删除统一返回 `{ code, message, data }`。
- 登录、退出、菜单和按钮权限改为 JSON API。
- 数据库、Redis、RocketMQ、游戏服务地址改为环境变量。
- 补齐数据库结构、接口测试、权限测试和业务回归测试。
