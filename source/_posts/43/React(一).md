---
title: React(一)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog43.jpg
date: 2018/08/25
---

最近一周工作太忙了，用 C# 写了 API、建了数据库、部署了服务器(从 Docker 迁移回了 IIS，API 在 Docker 中的访问速度不稳定，出现随机访问超时问题，应该是 Windows 下，Docker 性能有问题或 SELinux 的问题？)、写了一个钉钉的 E 应用接入公司的系统。由于一直写前台，这一段时间确实认识到了对后台的了解不够深入，但路还是得一步一步走。

---

言归正传，这一篇开始，我们就开始学习 React 的知识，我们首先介绍一下 React。
React 是由 Facebook 公司开源的一个 JS Library，官方说法是: 
> A declarative, efficient, and flexible JavaScript library for building user interfaces. 

从中可以看出 React 不是一个框架，它只是一个库。它只提供 UI 层面的解决方案。在实际的项目当中，它并不能解决我们所有的问题，需要结合其它的库，例如 Redux、React-router 等来协助提供完整的解决方法。
我们在开发过程中常常听到组件化这个词，在前端开发中，组件化可以帮助我们解决前端结构的复用性问题，整个页面可以由这样的不同的组件组合、嵌套构成。

一个组件有自己的显示形态和行为，组件的显示形态和行为可以由数据状态(state)和配置参数(props)共同决定。数据状态和配置参数的改变都会影响到这个组件的显示形态。

当数据变化的时候，组件的显示需要更新。所以如果组件化的模式能提供一种高效的方式自动化地帮助我们更新页面，那也就可以大大地降低我们代码的复杂度，带来更好的可维护性。

## React 基本环境安装
***  
想要在生产环境使用 React ，需要一堆的库以及工具来辅助: 编译阶段需要 babel、帮助管理状态需要 Redux、构建单页面应用需要 React-router 等等，这也就是所谓的 React 全家桶。

### npm 的安装配置
在正式学习 React 技术栈之前，我们先来介绍一下之后经常要使用到的 npm。
npm 是一个基于 nodejs 的 JavaScript 包管理工具，全称叫做 node package manager。(类似于 iOS 开发中的 Cocoapods，C# 中的 NuGet)。
所谓的包呢，其实就是可复用的代码，每个人都可以把自己编写的代码库发布到 npm 的源(registry)上面进行管理，你也可以下载别人开发好的包，在你自己的应用当中使用。通过使用 npm 作为项目的包管理工具，我们可以很方便地在我们的开发项目中引入以及管理第三方的框架或者库，而不需要像以前，手动下载复制粘贴代码文件。

npm 的安装非常简单，不管你是用的是什么操作系统，我们只需要打开 nodejs 官网，网站会自动匹配你的系统显示相应的安装包，点击 LTS 版本的下载按钮，等待安装包下载完成。安装完成 nodejs 之后，npm 也已经自动安装到系统中了。

安装完成之后，我们可以通过: 
``` bash
node -v //检查 node 版本
npm -v //检查 npm 版本
```

由于 npm 官方的服务器在国外，在国内使用可能会遇到很多网络问题，为了方便我们的开发，你可以使用我们定制的 cnpm (gzip 压缩支持) 命令行工具代替默认的 npm。国内最稳定的镜像源是[淘宝](https://npm.taobao.org/)提供的。

首先，以管理员身份打开命令行，输入: 
``` bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

从 registry.npm.taobao.org 安装所有模块，当安装的时候发现安装的模块还没有同步过来，淘宝 NPM 会自动在后台进行同步，并且会让你从官方 NPM registry.npmjs.org 进行安装，下次你再安装这个模块的时候, 就会直接从淘宝 NPM 安装了。

然后，我们通过: 
``` bash
cnpm install react react-dom --save
```

来安装 React，并添加到项目依赖里。

### yarn 的安装配置
相比于 npm，新的包管理工具 yarn 具有极其快速、特别安全以及超级可靠的优点。我们根据[官方文档](https://yarnpkg.com/en/)进行安装。
#### 最常用的命令如下: 
- 初始化新项目

``` shell
yarn init
```
- 添加依赖包

``` shell
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]
```
- 将依赖项添加到不同依赖项类别，分别添加到 devDependencies、peerDependencies 和 optionalDependencies

``` shell
yarn add [package] --dev
yarn add [package] --peer
yarn add [package] --optional
```
- 升级依赖包

``` shell
yarn upgrade [package]
yarn upgrade [package]@[version]
yarn upgrade [package]@[tag]
```
- 移除依赖包

``` shell
yarn remove [package]
```
- 安装项目的全部依赖

``` shell
yarn
# 或者
yarn install
```

### 使用 create-react-app 命令行工具
通过 cnpm，我们可以安装许多命令行工具。 React 官方专门为我们准备了专用的 React 项目生成工具 create-react-app，只需要简单几行代码即可生成 React 项目，并且在开发时还支持实时更新、自动重载等功能。
``` bash
create-react-app my-app
cd my-app
cnpm start
```

或者使用 yarn 来操作: 
``` bash
yarn create react-app my-app
cd my-app
yarn start
```

## JSX
***  
JSX 其是一个语法扩展，它既不是单纯的字符串，也不是 HTML，虽然长得和 HTML 很像甚至基本上看起来一样。但事实上它是 React 内部实现的一种，允许我们直接在 JS 里书写 UI 的方式: 
``` HTML
<div className='box' id='content'>
  <div className='title'>Hello</div>
  <button>Click</button>
</div>
```

上面的 DOM 可以表示成如下 JavaScript 中的对象: 
``` javascript
{
  tag: 'div',
  attrs: { className: 'box', id: 'content'},
  children: [
    {
      tag: 'div',
      arrts: { className: 'title' },
      children: ['Hello']
    },
    {
      tag: 'button',
      attrs: null,
      children: ['Click']
    }
  ]
}
```

我们发现，HTML 的信息和 JavaScript 所包含的结构和信息其实是一样的，我们可以用 JavaScript 对象来描述所有能用 HTML 表示的 UI 信息。但是用 JavaScript 写起来太长了，结构看起来又不清晰，用 HTML 的方式写起来就方便很多了。
于是 React 就把 JavaScript 的语法扩展了一下，让 JavaScript 语言能够支持这种直接在 JavaScript 代码里面编写类似 HTML 标签结构的语法，这样写起来就方便很多了。编译的过程会把类似 HTML 的 JSX 结构转换成 JavaScript 的对象结构。

### JSX 原理
我们想要在浏览器里直接运行采用 JSX 语法的 JavaScript 显然暂时是不可能实现的，在实际的生产过程中，我们需要利用 Babel 一类的转译器来将我们的 JSX 语法或者 ES6 语法转译成浏览器可以直接运行的 JavaScript，事实上 JSX 在经过转译之后，会变成一个方法调用: 
``` javascript
ReactDOM.render(
    <p>Hello React!</p>,
    document.getElementById('container');
);
```

转译之后就会变成下面这样: 
``` javascript
ReactDOM.render(
    React.createElement('p,' null, `Hello React!`),
    document.getElementById('container');
);
```

React.createElement() 函数会构建一个 JavaScript 对象来描述你 HTML 结构的信息，包括标签名、属性、还有子元素等。这样的代码就是合法的 JavaScript 代码了。所以使用 React 和 JSX 的时候一定要经过编译的过程。
所谓的 JSX 其实就是 JavaScript 对象。每当在 JavaScript 代码中看到这种 JSX 结构的时候，要在我们的脑海中进行自动转化，这样对理解 React 的组件写法很有好处。可以理解为: JSX 本质是一种语法糖。

### JSX 基本语法
#### JSX 元素
``` javascript
const title = (<h1>React Learning</h1>);
```

我们用 JSX 创建的元素对象一般来说是不变的，所以通过 const 关键字来声明一个 React 元素。

#### JSX 属性
JSX 的标签同样可以拥有自己的属性: 
``` javascript
const title = (<h1 id="main">React Learning</h1>);
```

但它和 HTML 又不是完全相同的，因为他们本质上是 JS 对象，所以 class、for 等 JS 中的关键字不可以使用，例如我们想要为 JSX 标签添加 class 的时候需要使用 className，for 需要使用 htmlFor: 
``` javascript
// 注意使用 className 而不是 class
const title = (<h1 className="main">React Learning</h1>);
```

#### JSX 嵌套
JSX 的标签也可以像 HTML 一样相互嵌套，一般有嵌套结构的 JSX 元素外面，我们习惯于为它加上一个小括号: 
``` javascript
const title = (
  <div>
    <h1 className="main">React Learning!</h1>
    <p>Let`s learn React</p>
  </div>
);
```

需要注意的是，JSX 在嵌套时，最外层有且只能有一个标签，否则就会出错: 
``` javascript
// 错误！
const title = (
  <h1 className="main">React Learning!</h1>
  <p>Let`s learn React</p>
);
```

如果希望渲染完成之后，DOM 中没有新增节点，我们可以使用 Fragment 组件包裹: 
``` javascript
const title = (
  <Fragment>
    <h1 className="main">React Learning!</h1>
    <p>Let`s learn React</p>
  </Fragment>
);
```

#### JSX 表达式
在 JSX 元素中，我们同样可以使用 JavaScript 表达式，在 JSX 当中的表达式需要用一个大括号括起来: 
``` javascript
let name = "1ess";
const title = (
  <div>
    <p>Let`s learn React now, {name}.</p>
  </div>
);
```