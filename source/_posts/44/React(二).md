---
title: React(二)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog44.jpg
date: 2018/08/27
---

这一篇，我们将介绍 React 中最重要的概念之一 —— 组件。

## 元素与组件(Element & Component)
***  
### 元素
元素是构建 React 应用的最小单位。元素所描述的也就是你在浏览器中能够看到的东西。
我们在编写 React 代码时一般用 JSX 来描述 React 元素。
在作用上，我们可以把 React 元素理解为 DOM 元素，但实际上，React 元素只是 JS 当中普通的对象。React 内部实现了一套叫做 React DOM 的东西，或者我们称之为 Virtual DOM 也就是虚拟 DOM.通过一个树状结构的 JS 对象来模拟 DOM 树。

React 之所以快就是因为这一套虚拟 DOM 的存在，React 内部还实现了一个低复杂度高效率的 Diff 算法，不同于以往框架，例如 Angular 使用的脏检查。在应用的数据改变之后，React 会尽力少地比较，然后根据虚拟 DOM 只改变真实 DOM 中需要被改变的部分。并且通过这一层单独抽象的逻辑让 React 有了无限的可能，就比如 react native 的实现。

### 组件
要注意到，在 React 当中元素和组件是两个不同的概念，我们需要明确的是，组件是构建在元素的基础之上的。

React 官方对组件的定义，是指在 UI 界面中，可以被独立划分的、可复用的、独立的模块。
其实就类似于 JS 当中对 function 函数的定义，它一般会接收一个名为 props 的输入，然后返回相应的 React 元素，再交给 ReactDOM，最后渲染到屏幕上。

## 函数定义与类定义组件(Functional & Class)
***  
React 提供了两种定义组件的方法: 
- 函数定义组件，只需要定义一个接收 props 传值，返回 React 元素的方法即可: 

``` javascript
function Title(props) {
    return <h1>Hello, {props.name}!</h1>
}
// ES6
const Title = props => (<h1>Hello, {props.name}!</h1>);
```
- 类定义组件，也就是使用 ES6 中新引入的类的概念来定义 React 组件: 

``` javascript
class Title extends React.Component {
    render() {
        return <h1>Hello, {this.props.name}!</h1>
    }
}
```

组件在定义好之后，可以通过 JSX 描述的方式被引用，组件之间也可以相互嵌套和组合。

## 展示与容器组件(Presentational & Container)
***  
之前我们说过，React 不算是一个框架，他只关心视图层次，因此，他是如何处理数据与视图关系呢？为了解决这一问题，就引入了展示组件和容器组件的概念。正确的划分展示组件和容器组件是我们在开发 React 应用时的最佳实践。
``` javascript
class CommentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments = [];
        }
    }
    componentDidMount() {
        $.ajax({
            url: '/comment.json',
            dataType: 'json',
            success: comments => this.setState({comments = comments})
        });
    }
    renderComment({body, author}) {
        return <li>{body} - {author}</li>;
    }
    render() {
        return <ul>{this.state.comments.map(this.renderComment)}</ul>;
    }
}
```

这是一个回复列表组件，乍看上去很正常也很合理。但实际上在开发 React 应用时，我们应该避免写出这样的组件，因为这类组件担负的功能太多了。
它只是一个单一的组件，但需要同时负责初始化 state，通过 ajax 获取服务器数据，渲染列表内容，在实际应用中，可能还会有更多的功能依赖。

通过应用展示组件与容器组件的概念，我们可以把上述的单一组件重构为一个展示回复列表组件和回复列表容器: 
``` javascript
// 展示组件
class CommentList extends React.Component {
    constructor(props) {
        super(props);
    }
    renderComment({body, author}) {
        return <li>{body}-{author}</li>;
    }
    render() {
        return <ul>{this.props.comments.map(this.renderComment)}<ul>;
    }
}
```
``` javascript
// 容器组件
class CommentListContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state.comments = [];
    }
    componentDidMount() {
        $.ajax({
            url: '/comment.json',
            dataType: 'json',
            success: comments => this.setState({comments = comments})
        });
    }
    render() {
        return <CommentList comments={this.state.comments} />
    }
}
```

这样单一组件就分割成两个组件了。
我们再来明确一下展示组件和容器组件的概念: 

### 展示组件
- 主要负责组建内容如何展示
- 从 props 接收父组件传递的数据
- 大多数可以通过函数定义组件声明

### 容器组件
- 主要关注组件数据如何交互
- 拥有自身的 state，从服务器获取数据、或与 redux 等其他数据处理模块协作
- 需要通过类定义组件声明，并包含生命周期函数和其他附加方法

## 有状态与无状态组件(Stateful & Stateless)
***  
### 有状态组件
有状态的意思是这个组件能够获取储存改变应用或组件本身的状态数据，在 React 当中也就是 state，一些比较明显的特征是我们可以在这样的组件当中看到对 this.state 的初始化，或 this.setState 方法的调用等等。

### 无状态组件
这样的组件一般只接收来自其他组件的数据。一般这样的组件中只能看到对 this.props 的调用，通常可以用函数定义组件的方式声明。

注意: 并不是所有的展示组件都是无状态组件，所有的容器组件都是有状态组件。

## 受控与非受控组件(Controlled & Uncontrolled)
***  
### 受控组件
一般涉及到表单元素时我们才会使用这种分类方法，受控组件的值由 props 或 state 传入，用户在元素上交互或输入内容会引起应用 state 的改变。在 state 改变之后重新渲染组件，我们才能在页面中看到元素中值的变化，假如组件没有绑定事件处理函数改变 state，用户的输入是不会起到任何效果的，这也就是"受控"的含义所在。

### 非受控组件
类似于传统的 DOM 表单控件，用户输入不会直接引起应用 state 的变化，我们也不会直接为非受控组件传入值。想要获取非受控组件，我们需要使用一个特殊的 ref 属性，同样也可以使用 defaultValue 属性来为其指定一次性的默认值。

注意: 通常情况下，React 当中所有的表单控件都需要是受控组件。但正如我们对受控组件的定义，想让受控组件正常工作，每一个受控组件我们都需要为其编写事件处理函数。

## 组合与继承(Composition & Inheritance)
***  
React 当中的组件是通过嵌套或组合的方式实现组件代码复用的。通过 props 传值和组合使用组件几乎可以满足所有场景下的需求。这样也更符合组件化的理念，就好像使用互相嵌套的 DOM 元素一样使用 React 的组件，并不需要引入继承的概念。

React 官方也希望我们通过组合的方式来使用组件，如果你想实现一些非界面类型函数的复用，可以单独写在其他的模块当中在引入组件进行使用。