# React 前端入门教程：从零看懂并改造这个项目

> 适用项目：本仓库 `my-react-app`（用 `npm create vite@latest my-react-app -- --template react` 生成）
> 技术栈（以本项目 `package.json` 为准）：React 19 + Vite 8 + Vitest 4 + ESLint 10，GitHub Actions 自动部署到 GitHub Pages
> 适用人群：有后端开发基础、前端零基础的同学
> 学习方式：按顺序阅读，每章的"动手练习"自己敲一遍。预计 1~2 天可以全部走完

---

## 目录

0. 这份教程怎么用
1. 用后端的思维理解前端
2. 项目从哪来：npm 与 create-vite
3. 项目目录逐项解读
4. React 核心概念（结合本项目真实代码）
5. 常用命令速查
6. 动手练习（5 个递进练习）
7. 看懂 CI/CD：你的 GitHub Actions 工作流
8. 常见问题排查
9. 学习资源与下一步

---

## 0. 这份教程怎么用

你的三个学习目标，对应下面的章节：

| 学习目标 | 对应章节 |
| --- | --- |
| 1. 了解 React 框架 | 第 1、4 章 |
| 2. 掌握基本构建、测试、运行命令 | 第 5 章 + 练习 1/4/5 |
| 3. 能手动改代码实现基础功能 | 第 6 章练习 2/3 |

建议每读完一章，把对应的练习做一遍。练习之间有依赖关系，请按顺序做。

---

## 1. 用后端的思维理解前端

### 1.1 前端三件套

一个网页由三样东西组成：

- **HTML**：页面的"结构"。可以理解为数据库里的表结构 + 返回的 JSON 数据本身——它描述页面上有什么东西。
- **CSS**：页面的"样式"。负责颜色、大小、间距、布局，相当于给数据套了一层展示模板。
- **JavaScript**：页面的"行为"。负责交互逻辑：点击按钮、发请求、改数据，相当于后端的业务逻辑，只不过跑在浏览器里。

浏览器就是前端的"运行时"。它做两件事：把 HTML 解析成一颗**DOM 树**（内存里的一棵对象树，节点代表页面元素），然后执行 JavaScript 去增删改这颗树。

### 1.2 后端概念 → 前端概念对照表

你已经有后端基础，下面这张表能帮你快速建立映射：

| 后端概念 | 前端对应概念 | 说明 |
| --- | --- | --- |
| Maven / Gradle | npm（Node 包管理器） | 依赖管理和构建工具 |
| 依赖 jar 包 | `node_modules` 目录 | npm 下载的依赖都装在这里 |
| `pom.xml` | `package.json` + `package-lock.json` | 项目元信息 + 依赖版本锁定 |
| `application.yml` | `vite.config.js` | 构建/开发服务器配置 |
| 单元测试（JUnit） | Vitest + Testing Library | 前端单元测试 |
| 静态检查（Checkstyle / Sonar） | ESLint | 代码规范检查 |
| 打包部署（Maven package → 服务器） | `npm run build` → 静态文件 → GitHub Pages | 构建产物是纯静态文件 |
| CI/CD（Jenkins / GitLab CI） | GitHub Actions | 你项目里的 `.github/workflows/` |
| 控制层/Service/实体类 | 组件（Component） | React 的最小单元就是组件 |
| 方法的入参 | props（属性） | 父组件传给子组件的数据 |
| 方法内的局部变量/数据库状态 | state（状态） | 组件内部会变化的数据 |
| 方法返回值 | JSX（界面描述） | 组件返回"长什么样"的界面 |

### 1.3 为什么需要 React

如果直接用原生 JavaScript 操作 DOM，代码会长这样：

```js
// 伪代码：手动找到按钮，监听点击，然后手动更新页面上的数字
document.getElementById('btn').addEventListener('click', function () {
  const old = Number(document.getElementById('count').innerText)
  document.getElementById('count').innerText = String(old + 1)
})
```

这种"命令式"写法的问题：页面越复杂，"数据"和"界面"就越是两套东西，你必须在脑子里同步维护它们，很容易漏改、改错。

React 的思路是**声明式**：你只需要告诉 React"界面长什么样、数据是什么"，数据一变，React 自动帮你更新界面。这正是组件 + 状态（第 4 章）要讲的核心。

---

## 2. 项目从哪来：npm 与 create-vite

### 2.1 npm 是什么

npm（Node Package Manager）是 JavaScript 世界的"Maven"。它随 Node.js 一起安装。可以用下面命令确认你的环境：

```powershell
node -v
npm -v
```

本项目用的 Vite 8 需要 Node.js 20.19+，建议直接装最新的 LTS 版本（22 或 24）。

### 2.2 当初那条命令拆解

```powershell
npm create vite@latest my-react-app -- --template react
```

逐段拆解：

| 片段 | 含义 |
| --- | --- |
| `npm create vite@latest` | 拉取最新的 `create-vite` 脚手架工具 |
| `my-react-app` | 创建的项目目录名 |
| `--` | 把后面的参数原样传给脚手架工具（npm 的传参分隔符） |
| `--template react` | 使用 React 模板（不是 Vue、不是 vanilla） |

如果你是手动从零搭一个项目，需要自己安装并配置 Vite、React、ESLint、Vitest 一大堆东西；脚手架把这套标准配置一次性帮你生成好。学习阶段，理解"这是标准模板"就够了。

### 2.3 package.json 逐项解读（你项目里的真实内容）

```json
{
  "name": "my-react-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^19.2.8",
    "react-dom": "^19.2.8"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@testing-library/react": "^16.3.2",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.4",
    "@vitest/coverage-v8": "^4.1.10",
    "eslint": "^10.8.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.3",
    "globals": "^17.7.0",
    "jsdom": "^29.1.1",
    "vite": "^8.2.0",
    "vitest": "^4.1.10"
  }
}
```

关键点：

- **scripts**：定义了一组"快捷命令"，`npm run dev` 就是执行 `vite`。后端的 `mvn package` 也类似。注意：`npm test` 和 `npm run start` 这类内置命令可以省略 `run`，其他都要写成 `npm run xxx`。
- **dependencies**：运行时依赖。前端项目里几乎只有 React 本体，因为构建后所有 JS 都会被打包进静态文件，运行时不需要再装依赖。
- **devDependencies**：开发时用的工具（构建器、检查器、测试框架），类比 Maven 里的 test 依赖。`^19.2.8` 表示"允许安装 19.x 的最新补丁版"。
- **type: module**：项目代码使用 ES Module 语法（`import` / `export`），对应后端的"模块化"，但它是浏览器原生支持的 JS 模块规范。

### 2.4 node_modules 与 package-lock.json

- `node_modules`：npm 安装的所有依赖都放在这里，可能有几千个文件，**永远不要提交到 git**（本项目 `.gitignore` 里已经排除了它）。别人拿到项目后执行 `npm install` 即可还原。
- `package-lock.json`：把依赖的**精确版本**（包括传递依赖）锁定下来，类似 Maven 的版本锁定。它应该提交到 git，保证 CI 和本地的依赖完全一致。
- `npm ci`：严格按 `package-lock.json` 安装，速度更快更可靠，CI 里常用；本地日常用 `npm install` 就行。

### 2.5 第一次运行

```powershell
npm install        # 安装依赖（你本地应该已经装过了）
npm run dev        # 启动开发服务器
```

看到 `Local: http://localhost:5173/` 后，用浏览器打开。改代码保存，页面会自动刷新——这个能力叫 **HMR（Hot Module Replacement，热更新）**，后面练习 1 会亲自体验。

---

## 3. 项目目录逐项解读

你的项目（根目录）长这样：

```text
my-react-app/
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # GitHub Actions 工作流（CI/CD 核心）
├── node_modules/            # npm 依赖，勿提交 git
├── public/                  # 静态资源，原样拷贝到构建产物
│   └── icons.svg
├── src/                     # 你的源码都在这里
│   ├── assets/              # 图片等资源，import 后由 Vite 处理
│   ├── App.css              # App 组件的样式
│   ├── App.jsx              # 根组件（页面主体）
│   ├── App.test.jsx         # App 组件的单元测试
│   ├── index.css            # 全局样式
│   └── main.jsx             # 程序入口
├── dist/                    # npm run build 的产物（CI 里生成，勿手改）
├── coverage/                # 测试覆盖率报告（勿提交）
├── .gitignore               # git 忽略规则
├── .oxlintrc.json           # oxlint 配置（当前 lint 脚本用 ESLint，此文件暂未生效）
├── eslint.config.js         # ESLint 配置
├── index.html               # HTML 入口
├── package.json             # 项目元信息 + 命令 + 依赖
├── package-lock.json        # 依赖版本锁定
├── vite.config.js           # Vite 构建/开发服务器配置
├── vitest.config.js         # 测试框架配置
└── README.md                # 模板自带的说明
```

几个重点文件的职责：

### index.html（HTML 入口）

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>my-react-app</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

它只做了两件事：留一个 `<div id="root">` 空壳，然后用 `<script type="module">` 加载 `/src/main.jsx`。**React 会把整个页面"画"进这个空壳里**。想改浏览器标签页标题，改这里的 `<title>`。

### src/main.jsx（程序入口）

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

`createRoot(...)` 找到 `index.html` 里的 `#root` 节点，`.render(...)` 把 `<App />` 这棵组件树挂载进去。类比 Spring Boot 的 `main` 方法：它是一切启动的起点。`<StrictMode>` 是开发环境的"严格模式"，帮你提前暴露问题，生产构建不会生效。

### src/App.jsx（根组件）

这是你主要修改的文件。模板默认渲染了一个计数器按钮和一堆文档链接。后面第 4 章会用它的真实代码讲解 React 概念。

### public/ 与 src/assets/

- `public/` 下的文件**原样拷贝**到构建产物 `dist/`，在代码里用绝对路径引用（如 `/icons.svg`）。
- `src/assets/` 下的文件通过 `import logo from './assets/logo.svg'` 引用，Vite 会参与打包、自动加内容哈希（方便浏览器缓存）。

### 配置文件们

- `vite.config.js`：构建与开发服务器配置（插件、路径别名、`base` 等）。
- `vitest.config.js`：测试框架配置（这里指定了 `jsdom` 环境——因为测试要在 Node 里模拟浏览器 DOM）。
- `eslint.config.js`：代码检查规则。
- `.github/workflows/ci-cd.yml`：CI/CD 流水线，第 7 章专门讲。

---

## 4. React 核心概念（结合本项目真实代码）

这一章请对照 `src/App.jsx` 的真实内容阅读。

### 4.1 组件与组件树

React 的最小单元是**组件（Component）**——一个返回界面的 JavaScript 函数：

```jsx
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">...</section>
      ...
    </>
  )
}

export default App
```

组件可以嵌套，形成一棵**组件树**：

```text
createRoot
└── <App />                ← 根组件（你项目里的 App）
    ├── <section>...</section>
    ├── <div>...</div>
    └── <section>...</section>
```

类比后端：一个 Controller 可以调用多个 Service，Service 又可以调用多个 Repository。组件树也是同样的"分而治之"思想——把大页面拆成小组件。

组件函数有几个硬规矩：

- 名字必须**大写字母开头**（`App`、`Greeting`），小写开头的会被当成普通 HTML 标签。
- 必须返回一段 JSX（或者 `null`）。
- 每个文件通常只导出**一个组件**（`export default`），文件命名和组件同名，比如 `Greeting.jsx` 导出 `Greeting`。

### 4.2 JSX：在 JavaScript 里写界面

JSX 是"长得像 HTML 的 JavaScript 语法"。看模板里的真实代码：

```jsx
<button
  type="button"
  className="counter"
  onClick={() => setCount((count) => count + 1)}
>
  Count is {count}
</button>
```

它和 HTML 有三个关键区别：

1. **属性名用驼峰**：`class` 写 `className`，`onclick` 写 `onClick`，`for` 写 `htmlFor`。
2. **`{}` 里可以写 JavaScript 表达式**：`Count is {count}` 会把 `count` 的值拼进去；图片地址 `src={heroImg}` 同理。
3. **`<>...</>` 是 Fragment（片段）**：JSX 只能返回一个根节点，但你又不想多包一层无意义的 `<div>`，就用 `<>` 包一下。

另外，JSX 里的注释要写成 `{/* 注释内容 */}`，而不是 `<!-- -->`。

### 4.3 Props：父组件给子组件传数据

Props（属性）就是**父组件传给子组件的参数**，和函数入参一模一样。子组件通过形参接收：

```jsx
// 子组件：定义时声明要接收的参数
function Greeting({ name }) {
  return <p>你好，{name}！</p>
}

// 父组件：使用时就"传参"
<Greeting name="小明" />
```

规则：Props 是**只读**的，子组件不能改父组件传进来的值；要改数据就得用下面的 State。

### 4.4 State：组件内部会变的数据

看模板里计数器这三行，这是整个模板最核心的代码：

```jsx
const [count, setCount] = useState(0)

<button onClick={() => setCount((count) => count + 1)}>
  Count is {count}
</button>
```

逐段理解：

- `useState(0)` 声明一个状态，初始值是 `0`。
- `useState` 返回一个数组：`[当前值, 修改函数]`。解构语法 `const [count, setCount] = ...` 等价于：

  ```js
  const state = useState(0)
  const count = state[0]
  const setCount = state[1]
  ```

- 按钮被点击时执行 `setCount(...)`，React 收到通知：`count` 变了，于是**重新执行整个 App 函数，用新值重画界面**。
- 所以"点一下按钮，页面数字 +1"，你不需要手动去改 DOM 上的文字——你只声明了"界面显示 `{count}`"，剩下全是 React 干的。

这就是第 1.3 节说的"声明式"。写 React 的日常就是：**声明状态 → 界面上引用状态 → 事件里改状态**。

两个重要原则：

- **不要直接改状态**。`count = count + 1` 是无效的，必须调用 `setCount(...)`，React 才感知得到变化。
- **更新对象/数组时要创建新值**（不可变更新），练习 3 会示范。

### 4.5 事件处理

JSX 里给元素挂事件，直接写 `on事件名={处理函数}`：

```jsx
<button onClick={() => setCount(count + 1)}>加一</button>
<input onChange={(e) => setInput(e.target.value)} />
```

处理函数里常见的 `e` 是事件对象，`e.target` 是触发事件的元素，所以 `e.target.value` 就是输入框当前内容。

### 4.6 条件渲染与列表渲染

**条件渲染**——用 JS 的逻辑直接在 JSX 里做判断：

```jsx
{todos.length === 0 ? (
  <p>暂无待办</p>
) : (
  <ul>{/* 列表渲染 */}</ul>
)}
```

也可以用 `&&` 短路：`{todos.length === 0 && <p>暂无待办</p>}`。

**列表渲染**——用数组的 `map` 把数据变成一组 JSX：

```jsx
{todos.map((todo, index) => (
  <li key={index}>{todo}</li>
))}
```

每个列表项必须有一个**唯一的 `key`**（React 用它来高效地对比更新列表）。练习 3 会用到。

### 4.7 组件文件规范

- 一个组件一个文件：`src/components/TodoList.jsx` 里只写 TodoList 组件。
- 组件文件用 `export default 组件名` 导出，其他地方 `import TodoList from './components/TodoList.jsx'` 引入。
- 小知识：现在的模板**不需要写 `import React from 'react'`**，新的 JSX 编译方式会自动处理。很多老教程会让你写，看到时别慌。

---

## 5. 常用命令速查

所有命令都要在**项目根目录**（`package.json` 所在目录）执行。本教程默认你在 PowerShell 里。

### 5.1 命令总览

| 命令 | 干什么 | 什么时候用 |
| --- | --- | --- |
| `npm install` | 按 package.json 安装/更新依赖 | 刚克隆项目、依赖缺失时 |
| `npm ci` | 严格按 lock 文件装依赖 | CI 里、想完全复现依赖时 |
| `npm run dev` | 启动开发服务器（默认 5173 端口） | 日常开发，改代码即时生效 |
| `npm run build` | 打包出生产产物到 `dist/` | 发布前、验证能不能构建成功 |
| `npm run preview` | 本地预览 `dist/` 构建产物 | 验证打包结果像不像线上 |
| `npm run lint` | ESLint 检查代码规范 | 提交前、CI 里 |
| `npm test` | 跑一遍全部单元测试 | 提交前、CI 里 |
| `npm run test:watch` | 监听文件变化自动重跑测试 | 写测试时 |
| `npm test -- --coverage` | 跑测试并生成覆盖率报告（`coverage/`） | 想看重不覆盖时 |

### 5.2 每条命令详解

**`npm install` / `npm ci`**

安装依赖。第一次拿到项目（或删了 `node_modules`）时必须先跑。`npm ci` 会把版本严格对齐 `package-lock.json`，更慢一点但更可复现，CI 里常用。你的工作流里用的是 `npm install`，本地也一样没问题。

**`npm run dev`**

启动 Vite 开发服务器。特点：

- 启动快，内存里编译，按需加载；
- 改代码保存后页面自动更新（HMR），一般不需要手动刷新；
- 报错直接显示在页面上，方便定位。

停掉服务：在终端按 `Ctrl + C`。

**`npm run build`**

生成生产构建产物到 `dist/`：

```text
dist/
├── index.html
├── assets/    # 打包后的 JS、CSS、图片（文件名带内容哈希）
└── favicon.svg 等静态文件
```

类比 `mvn package` 的产物目录：`dist/` 就是"可发布的包"，里面是一堆纯静态文件，任何静态服务器都能托管。你项目里 CI 的 build 阶段做的就是这件事。

**`npm run preview`**

在本地起一个服务器来预览 `dist/` 的构建产物，模拟线上效果。注意：**直接双击打开 `dist/index.html` 往往是一片空白**，因为页面用了 ES Module 和相对根路径的资源，必须通过 HTTP 服务器访问。这是初学者常见困惑，记住"前端构建产物要用服务器预览"即可。

**`npm run lint`**

跑 ESLint 检查 `src` 等目录的代码。有问题会报出文件、行号和原因（英文）。养成习惯：提交前跑一下。`npm run lint -- --fix` 可以自动修复一部分问题。

**`npm test` / `npm run test:watch` / `--coverage`**

`npm test` 等价于执行 `vitest run`（跑一遍就退出，CI 场景）；`npm run test:watch` 进入监听模式，文件一变自动重跑（开发场景）。加 `--coverage` 会输出测试覆盖率，并在 `coverage/` 下生成 HTML 报告，浏览器打开 `coverage/index.html` 能看到可视化结果。

### 5.3 关于 `--` 传参

`npm run 脚本名 -- 额外参数` 中，`--` 后面的参数会原样追加到脚本命令后面。例如：

```powershell
npm run dev -- --port 5174
```

等价于执行 `vite --port 5174`（换端口）。这也是当初 `npm create vite ... -- --template react` 里 `--` 的用法。

---

## 6. 动手练习

建议把下面的练习按顺序做一遍。每个练习都可以随时 `git add` / `git commit` 保存进度（练习 5 会正式用到 git）。

### 练习 1：把项目跑起来 + 修改文字（感受 HMR）

**目标**：跑通 `dev`，体验"改代码 → 保存 → 页面自动变"。

**步骤**：

1. 在项目根目录执行 `npm run dev`，浏览器打开 `http://localhost:5173/`。
2. 打开 `src/App.jsx`，找到这一行：

   ```jsx
   <h1>Get started</h1>
   ```

3. 改成：

   ```jsx
   <h1>我的第一个 React 页面</h1>
   ```

4. 保存文件（`Ctrl + S`），回到浏览器。

**预期结果**：不用刷新，标题自动变成中文。这就是 HMR。

**验证**：`Ctrl + C` 停掉服务，执行 `npm run lint`，应该没有任何报错。

### 练习 2：创建你的第一个组件（学习 Props）

**目标**：自己写一个组件，通过 Props 传参，并在 App 里使用它。

**步骤**：

1. 新建目录和文件 `src/components/Greeting.jsx`，内容：

   ```jsx
   function Greeting({ name }) {
     return <p>你好，{name}！这是我自己写的第一个 React 组件。</p>
   }

   export default Greeting
   ```

2. 修改 `src/App.jsx`：在文件顶部 import 区域加一行：

   ```jsx
   import Greeting from './components/Greeting.jsx'
   ```

3. 在 `<section id="center">...</section>` 结束标签后面（`<div className="ticks"></div>` 之前）插入：

   ```jsx
   <Greeting name="小明" />
   ```

4. 保存，看页面。

**预期结果**：页面出现"你好，小明！这是我自己写的第一个 React 组件。"

**想一想**：把 `name="小明"` 改成 `name="小红"` 再保存，页面跟着变——这就是 Props 的意义：同一个组件，传入不同数据，渲染不同内容。试着把 `<Greeting name="小红" />` 复制一行，让两个 Greeting 同时出现（组件复用）。

### 练习 3：做一个待办清单（State 进阶：数组增删、条件渲染、列表渲染）

**目标**：实现"输入 → 添加待办 → 点击删除"，完整走一遍"状态 → 界面 → 事件"的闭环。这是 React 最典型的入门功能。

**步骤**：

1. 新建 `src/components/TodoList.jsx`：

   ```jsx
   import { useState } from 'react'

   function TodoList() {
     const [todos, setTodos] = useState(['学 React', '跑通 npm 命令'])
     const [input, setInput] = useState('')

     function addTodo() {
       if (input.trim() === '') return
       setTodos([...todos, input.trim()])
       setInput('')
     }

     function removeTodo(index) {
       setTodos(todos.filter((_, i) => i !== index))
     }

     return (
       <div>
         <h2>我的待办清单</h2>
         <input
           value={input}
           onChange={(e) => setInput(e.target.value)}
           onKeyDown={(e) => {
             if (e.key === 'Enter') addTodo()
           }}
           placeholder="输入新待办，回车添加"
         />
         <button type="button" onClick={addTodo}>
           添加
         </button>

         {todos.length === 0 ? (
           <p>暂无待办，添加一条吧</p>
         ) : (
           <ul>
             {todos.map((todo, index) => (
               <li key={index}>
                 {todo}
                 <button type="button" onClick={() => removeTodo(index)}>
                   删除
                 </button>
               </li>
             ))}
           </ul>
         )}
       </div>
     )
   }

   export default TodoList
   ```

2. 在 `src/App.jsx` 顶部 import：

   ```jsx
   import TodoList from './components/TodoList.jsx'
   ```

3. 在刚才的 `<Greeting ... />` 下面插入：

   ```jsx
   <TodoList />
   ```

4. 保存，在页面上玩一下：输入文字回车添加、点删除移除。

**预期结果**：能添加、能删除；全部删完后出现"暂无待办"提示。

**这段代码里藏着三个必懂的点**：

1. `setTodos([...todos, input.trim()])` —— 用展开运算符创建**新数组**再追加，而不是 `todos.push(...)`。因为 React 靠"引用变了"来感知更新，直接 `push` 是在旧数组上原地修改，React 不会重新渲染。
2. `todos.filter((_, i) => i !== index)` —— `filter` 同样返回新数组，过滤掉要删的那一项，实现"删除"。
3. `<li key={index}>` —— 列表项的 `key` 要唯一。这里用下标，功能上没问题；如果列表会排序/增删频繁，更推荐用每条数据自己的 id。

### 练习 4：给 TodoList 写单元测试

**目标**：会写最简单的 React 测试，跑通 `npm test`。

**步骤**：

1. 新建 `src/components/TodoList.test.jsx`：

   ```jsx
   import { fireEvent, render, screen } from '@testing-library/react'
   import { describe, expect, it } from 'vitest'
   import TodoList from './TodoList'

   describe('TodoList', () => {
     it('输入内容并点击添加后，新待办出现在列表里', () => {
       render(<TodoList />)

       const input = screen.getByPlaceholderText('输入新待办，回车添加')
       fireEvent.change(input, { target: { value: '学 GitHub Actions' } })
       fireEvent.click(screen.getByRole('button', { name: '添加' }))

       expect(screen.getByText('学 GitHub Actions')).toBeTruthy()
     })

     it('点击删除后，对应待办从列表里消失', () => {
       render(<TodoList />)

       // 初始有两项：学 React、跑通 npm 命令，先删第一项
       const deleteButtons = screen.getAllByRole('button', { name: '删除' })
       fireEvent.click(deleteButtons[0])

       expect(screen.queryByText('学 React')).toBeNull()
     })
   })
   ```

2. 运行：

   ```powershell
   npm test
   ```

**预期结果**：输出显示 2 个测试全部通过（再加上模板自带的 App 测试，共 4 个）。

**这段代码在做什么**：

- `render(<TodoList />)`：把组件挂载到 jsdom 提供的"假浏览器"里。
- `screen.getByText(...)` / `getByRole(...)`：像人一样**查找界面元素**（按文字、按角色）。找不到会直接让测试失败，报错信息会列出页面上有什么，方便排查。
- `fireEvent.change` / `fireEvent.click`：模拟用户输入和点击。
- `expect(...).toBeTruthy()` / `toBeNull()`：断言。这里特意没用需要额外安装的 `toBeInTheDocument()`，模板依赖里没有它。

想边写边跑，用 `npm run test:watch`，保存测试文件会自动重跑。

### 练习 5：提交代码，让 GitHub Actions 自动部署

**目标**：走一遍完整的"推代码 → CI 检查 → 自动部署到 Pages"。

**步骤**：

1. 先看第 7.4 节，确认/配置 `vite.config.js` 的 `base`（否则 Pages 可能白屏）。
2. 在项目根目录执行：

   ```powershell
   git add .
   git commit -m "feat: 添加 Greeting 和 TodoList 组件"
   git push origin main
   ```

3. 打开 GitHub 仓库页面 → **Actions** 标签页，能看到本次提交触发的流水线，包含 lint、test、build、deploy 四个任务，点击可以看每一步日志。
4. 全部通过后，打开你的 Pages 地址（仓库 Settings → Pages 里能看到，形如 `https://用户名.github.io/my-react-app/`）。

**预期结果**：页面上能看到你做的 Greeting 和 TodoList。

**小提示**：第一次部署如果白屏，别慌——先看第 7.4 节和第 8 章的排查方法，这是本教程给你埋的"真实排错训练"。

---

## 7. 看懂 CI/CD：你的 GitHub Actions 工作流

打开 `.github/workflows/ci-cd.yml`，我们一起把它读完。它是你学 GitHub Actions 的现成教材。

### 7.1 触发时机与权限

```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write
```

- 往 `main` 分支 push 代码、或对 `main` 开 PR 时触发。PR 触发时不会部署（见 7.2）。
- `permissions`：GitHub Actions 默认权限很受限，部署 Pages 必须显式授予 `pages: write` 和 `id-token: write`（OIDC 身份令牌，用于安全验证）。
- `concurrency` 段：同一分支的多个运行排队/取消，防止部署互相打架。

### 7.2 四个 job（任务）逐个讲

工作流里定义了 4 个 job：`lint` → `test` → `build` → `deploy`，用 `needs` 串成依赖链：

```yaml
build:
  needs: [lint, test]     # 前两步都成功才构建

deploy:
  needs: [build]          # 构建成功才部署
  if: github.ref == 'refs/heads/main'   # 只有 main 分支才部署
```

**lint（代码检查）**：`actions/checkout@v4` 拉代码 → `actions/setup-node@v4` 装 Node（还开了 npm 缓存加速）→ `npm install` → `npm run lint`。有个细节：

```yaml
- name: 检查类型（如果有 TypeScript）
  run: npm run type-check || echo "⚠️ 没有类型检查脚本"
```

本项目没有 `type-check` 脚本，所以这条命令会"失败"，但 `||` 兜底让它不阻断流水线。这是"可选步骤"的常见写法（更规范的做法是给 job 加 `continue-on-error`）。

**test（单元测试）**：`npm test -- --coverage` 跑测试并生成覆盖率，然后用 `actions/upload-artifact@v4` 把 `coverage/` 目录上传为构建产物（artifact）。Artifact 是 CI 里的"文件快照"，可以在运行结果页面下载查看。

**build（构建打包）**：`npm run build` 生成 `dist/`，打印产物信息，还生成一个 `dist/version.json` 记录版本号、commit 等信息，最后把 `dist/` 上传为 artifact。

**deploy（部署）**：下载 build 的 artifact → `configure-pages` / `upload-pages-artifact` / `deploy-pages` 三步把 `dist/` 发布到 GitHub Pages，并输出访问地址。

整条流水线和你熟悉的后端 CI/CD 完全同构：**静态检查 → 单元测试 → 打包 → 部署**，只是工具名不同。

### 7.3 GitHub Pages 部署前提（首次配置）

仓库需要允许 Actions 部署 Pages：

1. GitHub 仓库 → **Settings** → **Pages**。
2. "Build and deployment" 的 **Source** 选择 **GitHub Actions**（不是 "Deploy from a branch"）。

配置好后，每次 push 到 main，流水线跑完网站就自动更新了。

### 7.4 重要：Pages 子路径与 Vite 的 base 配置（真实坑）

打开 `dist/index.html`（构建产物），你会发现资源路径是**以 `/` 开头的绝对路径**：

```html
<script type="module" crossorigin src="/assets/index-xxx.js"></script>
```

浏览器访问 `https://用户名.github.io/my-react-app/` 时，这个 `/assets/...` 会去请求 `https://用户名.github.io/assets/...`——**找不到，页面白屏**。原因：Vite 默认 `base` 是 `/`，假设站点部署在域名根路径；而 GitHub Pages 的项目站点部署在 `/仓库名/` 子路径下。

解决办法：在 `vite.config.js` 里配置 `base`，让它和你的 Pages 子路径一致：

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/my-react-app/',   // 改成你自己的仓库名
})
```

改完重新 `npm run build`，`dist/index.html` 里的路径会变成 `/my-react-app/assets/...`，部署后就能正常加载了。

什么时候**不用**配：你的 Pages 地址恰好是根路径（仓库名就是 `用户名.github.io`）时，`/` 本来就对，不用配。

本地 `npm run dev` 不受 `base` 影响，所以"本地好好的、线上白屏"基本就是这个原因。

---

## 8. 常见问题排查

### 终端中文乱码

文件本身是 UTF-8，是 Windows 终端用 GBK 显示导致的。解决：在终端执行 `chcp 65001`，或者用 VS Code 内置终端（默认 UTF-8）。GitHub 上的 Actions 日志不受影响。

### 报错 `vite : 无法将“vite”项识别为 cmdlet...`

`node_modules` 没装或损坏。执行 `npm install` 后重试。

### `npm run dev` 端口被占用

Vite 默认 5173，被占用时会自动换 5174 等端口（注意看终端输出）。也可以手动指定：`npm run dev -- --port 5174`。

### 改了代码页面没反应

确认：`npm run dev` 还开着；改的是 `src/` 下的文件；保存成功。如果是新增文件，注意 import 路径大小写要和文件名一致（Windows 下大小写不敏感，Linux/CI 下敏感，最好始终一致）。

### 打开 `dist/index.html` 一片空白

正常现象。构建产物必须通过 HTTP 服务器访问：用 `npm run preview`，或部署到 Pages 后访问线上地址。

### 部署到 Pages 后白屏 / 资源 404

先按 7.4 检查 `base` 配置，再重新构建、推送。排查技巧：浏览器按 F12 打开 Network 标签，看失败请求的地址是不是少了 `/仓库名/` 前缀。

### ESLint 报错

- `react-refresh/only-export-components`：组件文件里除了组件还导出了别的东西（比如工具函数）。把组件和工具函数拆到不同文件即可。
- `react-hooks/rules-of-hooks`：`useState` 必须在组件函数顶层调用，不能放在 `if`、循环或普通函数里。

### 测试报错 `Unable to find an element...`

说明页面里找不到你要的文本/元素。检查：文字是否完全一致（大小写、空格）、组件是否真的渲染了、测试渲染的是不是最新代码（监听模式下保存测试文件会自动重跑）。

### npm 下载慢 / 超时

换成国内镜像：

```powershell
npm config set registry https://registry.npmmirror.com
```

### 改了 `package.json` 里的 scripts 不生效

改完脚本名（比如把 `"dev"` 改成 `"start"`）后，要么重启终端，要么确认命令写对了：内置命令（`test`、`start`）可省略 `run`，自定义命令必须写 `npm run 名字`。

---

## 9. 学习资源与下一步

### 官方资源（免费、中文友好）

- **React 官方教程**：[https://react.dev/learn](https://react.dev/learn) —— 最好的入门材料，有中文版，内置可交互练习。学完本教程后再过一遍，会有"哦原来如此"的感觉。
- **Vite 文档**：[https://vite.dev/guide](https://vite.dev/guide) —— 了解 dev/build/preview 的更多配置。
- **MDN JavaScript 教程**：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript) —— 补 JS 语法基础（数组方法、对象、解构等，本教程里都用到了）。
- **GitHub Actions 文档**：[https://docs.github.com/zh/actions](https://docs.github.com/zh/actions) —— 你的 CI 工作流语法参考。

### 建议的下一步路线

1. **TypeScript**：给 JS 加类型，后端同学上手最快，Vite 有现成的 `--template react-ts` 模板。
2. **React Router**：让页面支持多个"路由"（多页面应用），比如 `/home`、`/about`。
3. **fetch 调后端 API**：用 `fetch` 或 axios 请求你自己的后端接口，把数据显示在页面上（这时你会发现 React 的思维模式和后端交互天然契合）。
4. **CSS 方案**：CSS Modules / Tailwind CSS，解决样式命名冲突和复用问题。
5. **状态管理**：当多个组件共享状态、项目变大时，再学 Zustand / Redux（现阶段完全不需要）。

### 学习目标自检清单

学完本教程后，你应该能回答：

1. **React 是什么**：用组件 + 状态声明式地描述界面，数据变了自动更新 UI。
2. **命令**：`npm run dev`（开发）、`npm run build`（打包到 dist）、`npm test`（测试）、`npm run lint`（检查）、`npm run preview`（预览产物）。
3. **改代码**：能新建组件、传 Props、用 `useState` 实现输入/添加/删除列表，并给组件写测试。
4. **额外收获**：看懂自己的 GitHub Actions 流水线，知道 push 到 main 后发生了什么，以及 Pages 白屏时往哪儿查。

祝你学习顺利！
