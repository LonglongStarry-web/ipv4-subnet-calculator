# IPv4 子网计算器

面向网络基础学习的中文交互工具：输入 IPv4 地址、拖动 CIDR 前缀，查看网络地址、地址块终点、主机范围及按位与运算。

## 功能

- IPv4 四段输入校验，支持 `/0` 到 `/32`。
- 二进制区分网络位和主机位，展示 IP AND 掩码的结果。
- 计算子网掩码、网络地址、广播地址、可用主机数量与范围。
- `/31` 按点对点链路解释，`/32` 按单主机路由解释；两者不标作广播地址。
- 支持桌面和手机，允许浏览器缩放；构建后无运行时 CDN 依赖。

## 本地运行

需要 Node.js 22.12+ 和 npm。

```sh
npm ci
npm run dev
```

开发地址以终端输出为准。`npm test` 运行算法回归测试，`npm run build` 生成 `dist/`，`npm run preview` 预览构建结果。

## 项目结构

```text
src/App.jsx       输入、结果和二进制展示
src/subnet.js     独立的计算与校验逻辑
src/main.jsx      React 入口
src/style.css     Tailwind 样式入口
test/             边界与非法输入测试
IPSubnetCalculator.jsx  旧导入路径兼容出口
.github/workflows/ 检查与 GitHub Pages 部署
```

## GitHub Pages

仓库 Settings → Pages → Source 选择 **GitHub Actions**，然后运行 Deploy Pages 工作流；推送到 main 也会触发。工作流先执行测试和构建，再部署静态产物。不要将包含 JSX 的源码直接当静态网页发布。

## 适用范围

当前是单个 IPv4 地址块的计算与教学工具，不包含 IPv6、VLSM 自动规划或网络扫描。可用地址数采用常规子网算术，不代表每个地址在公网均可分配；特殊用途地址需要结合网络环境判断。

## 开发约定

修改计算规则时同时运行 `npm test`；界面始终调用 `src/subnet.js`，避免维护两份算法。依赖版本由 `package-lock.json` 固定。尚未声明开源许可证。
