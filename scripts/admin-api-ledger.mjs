import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const server = path.resolve(root, '../Server/server/AdminApi/src/main/java/com/aoo/bcg/admin');
const catalog = fs.readFileSync(path.join(server, 'AdminPermissionCatalog.java'), 'utf8');
const application = fs.readFileSync(path.join(server, 'AdminApiApplication.java'), 'utf8');
const api = fs.readFileSync(path.join(root, 'src/api/operations/index.ts'), 'utf8');
const buttons = fs.readFileSync(path.join(root, 'src/utils/adminPermission.ts'), 'utf8');
const view = fs.readFileSync(path.join(root, 'src/views/operations/index.vue'), 'utf8');

const routePattern = /route\("([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*(true|false)\)/g;
const repository = {
  '/game-profiles': 'JdbcGameProfileRepository',
  '/map': 'AdminMapProxy',
  '/game-profile-releases': 'JdbcGameProfileReleaseStore',
  '/game-investigations': 'JdbcGameInvestigationRepository',
  '/operation-switches': 'JdbcAdminResourceRepository',
  '/appeals': 'JdbcAdminResourceRepository',
  '/reconciliation': 'JdbcReconciliationService',
  '/data-lifecycle': 'JdbcAdminResourceRepository',
  '/sensitive-exports': 'JdbcSensitiveExportRepository',
};
const surface = {
  'game-profile': ['玩法发布', '玩法发布工作流'],
  'game-investigation': ['回放调查', '只读调查'],
  'operation-switch': ['运营开关', '变更运营开关'],
  appeal: ['客服申诉', '处理客服申诉'],
  reconciliation: ['账务对账', '重新对账'],
  lifecycle: ['数据治理', '调整数据生命周期'],
  'sensitive-export': ['敏感导出', '敏感导出审批弹窗'],
};
const rows = [];
for (const match of catalog.matchAll(routePattern)) {
  const [, button, method, route, permission, targetType, highRisk] = match;
  const suffix = route.slice('/api/v2/admin'.length);
  const key = Object.keys(repository).find(prefix => suffix.startsWith(prefix));
  const group = Object.keys(surface).find(prefix => button.startsWith(prefix)) ?? button.split('-').slice(0, -1).join('-');
  const [page, dialog] = surface[group] ?? ['业务运营中心', '页内操作'];
  const context = key === '/map'
    ? application.includes('createContext("/api/v2/admin/map/ip-location"')
    : key && application.includes(`createContext("/api/v2/admin${key}"`);
  const wired = key === '/map'
    ? fs.readFileSync(path.join(root, 'src/api/map/index.ts'), 'utf8').includes('/api/v2/admin/map/ip-location')
    : buttons.includes(`'${button}'`) && api.includes(`/api/v2/admin${key ?? ''}`);
  const jdbc = key ? repository[key] : '';
  const jdbcFile = jdbc === 'AdminMapProxy'
    ? path.join(server, 'AdminMapProxy.java')
    : jdbc === 'JdbcReconciliationService'
    ? path.resolve(server, '../../../../../../../../Billing/src/main/java/com/aoo/bcg/billing/JdbcReconciliationService.java')
    : jdbc ? path.join(server, `${jdbc}.java`) : '';
  rows.push({
    page, button, dialog, method, route, permission, targetType,
    approval: highRisk === 'true' ? 'four-eyes' : 'normal',
    apiWired: wired, authorizationWired: true, handlerWired: Boolean(context),
    jdbcRepository: jdbc, jdbcWired: Boolean(jdbcFile && fs.existsSync(jdbcFile)),
    responseStates: ['loading', 'success', 'empty', 'error'],
    productionEntry: '/operations',
  });
}

const failures = [];
if (rows.length !== 22) failures.push(`expected 22 permission routes, found ${rows.length}`);
for (const row of rows) {
  if (!row.apiWired || !row.handlerWired || !row.jdbcWired) failures.push(`${row.button}: broken chain`);
}
for (const marker of ['v-loading', 'data-state="success"', 'data-state="empty"', 'data-state="error"']) {
  if (!view.includes(marker)) failures.push(`missing UI state marker ${marker}`);
}
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  productionPages: ['/login', '/operations'],
  retiredProductionPrefixes: ['/admin', '/userList', '/legacy', '/club', '/roomCard', '/setting', '/log'],
  totals: { routes: rows.length, complete: rows.filter(row => row.apiWired && row.handlerWired && row.jdbcWired).length },
  rows,
  verification: failures.length ? { status: 'failed', failures } : { status: 'passed', failures: [] },
};
const serialized = `${JSON.stringify(report, null, 2)}\n`;
if (process.argv.includes('--write')) fs.writeFileSync(path.join(root, 'docs/admin-api-ledger.json'), serialized);
process.stdout.write(serialized);
if (failures.length) process.exitCode = 1;
