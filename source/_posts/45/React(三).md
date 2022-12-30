---
title: React(三)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog45.jpg
date: 2018/08/29
---

这一篇，我们看看组件对于数据的处理以及组件的生命周期。

## props
***  
props 作用: 
- 传入变量
- 传入函数
- 传入组件
- props.children

props 其实就是属性 Properties 的缩写。
在形式上，props 之于 JSX 就相当于 attributes 之于 HTML。从写法上来看呢，我们为组件传入 props 就可以像为 HTML 标签添加属性一样: 
``` javascript
const SimpleButton = props => 
( 
  <button className={props.className}>
    {props.buttonTitle}
  </button>
);
ReactDOM.render(<SimpleButton  className="sb" buttonTitle="SimpleButton" />, document.getElementById('container'));
```

### props 是只读的
在 React 中，props 都是自上向下传递，从父组件传入子组件。并且 props 是只读的，我们不能在组件中直接修改 props 的内容。

### props 类型检查
正是因为 props 的强大，什么类型的内容都可以传递，所以在开发过程中，为了避免错误类型的内容传入，我们可以为 props 添加类型检查。

### props 默认值
由于 props 是只读的，我们不能直接为 props 赋值。React 专门准备了一个方法定义 props 的默认值。
``` javascript
const SimpleButton = props => (
  <button className={props.className}>
    {props.buttonTitle}
  </button>
);

SimpleButton.defaultProps = {
    className: "defaultClassName",
    buttonTitle: "defaultButtonTitle"
};

SimpleButton.propTypes = {
    className: PropTypes.string.isRequired,
    buttonTitle: PropTypes.string.isRequired
};
```

## state
***  
- 初始化
- setState 方法
- 向下传递数据

在 React 中 state 也是我们进行数据交互的地方，又或者叫做 state management 状态管理。
一个应用需要进行数据交互，比如同服务器之间的交互，同用户输入进行交互。或者反过来，从 API 获取数据，处理用户输入也就是我们需要用到 state 的时候。

在新版本的 React 当中，我们通过类定义组件来声明一个有状态组件，之后在它的构造方法中初始化组件的 state，我们可以先赋予它默认值。

之后就可以在组件中通过 this.state 来访问它，和之前的 props 一样，初始化 state 之后，如果我们想改变它，是不可以直接对其赋值的，直接修改 state 的值没有任何意义，因为这样的操作脱离了 React 运行的逻辑，不会触发组件的重新渲染。所以需要 this.setState 这个方法，在改变 state 的同时，触发 React 内部的一系列函数，最后在页面上重新渲染出组件。

随着我们开发应用的逐步扩展，state 也会变得越来越庞大复杂，假如分散到各个组件当中，对于日后应用的维护者来说将是一个噩梦。怎么处理怎么储存应用的 state 非常值得我们深入去思考，由此也就引发了一个问题——状态管理。这也正是 Redux 要解决的问题。

## React 是如何渲染组件的
***  
我们按照平时书写 React 代码的顺序来理清 React 把组件代码渲染到最终的真实 DOM 中的流程。
一般来讲，我们都会先定义一个组件。我们如果想要在页面中看到这个组件的渲染结果，就需要以 JSX 的形式将组件传入 ReactDOM.render 方法的第一个参数，我们一直说，这里的 JSX 经过 React 内部的转译，将 JSX 转换为 React.createElement 方法来创建的 React 元素。render 方法获取到 React 元素之后会将它实例化，之后它会根据实例化的 React 元素创建出真实的 DOM 元素，再根据第二个参数的指向，将创建好的元素插入到目标 DOM 容器当中。

在新版本的 React 当中，将 React 应用界面更新的过程分为了两个主要的部分: 
- 调度过程
- 执行过程

在调度过程中，有 4 个生命周期函数会被触发: 
- componentWillMount
- componentWillReceiveProps
- shouldComponentUpdate
- componentWillUpdate

在执行过程中，有 3 个生命周期函数会被触发: 
- componentDidMount
- componentDidUpdate
- componentWillUnmount

官方推荐在 componentDidMount 函数中进行一些例如 ajax 请求的操作，所以它也是我们最经常使用的生命周期函数。

## 表单及事件处理
***  
之前说过受控组件与非受控组件的概念。受控与非受控组件就是专门适用于 React 当中的表单元素的。
在 HTML 中，表单元素与其他元素最大的不同是它自带值或数据，而且在我们的应用中，只要是有表单出现的地方，就会有用户输入，就会有表单事件触发，就会涉及的数据处理。

为了更好地管理应用中的数据，响应用户的输入，编写组件的时候，我们就会运用到受控组件与非受控组件这两个概念。

React 推荐我们在绝大多数情况下都使用受控组件。这样可以保证表单的数据在组件的 state 管理之下，而不是各自独立保有各自的数据。

### 表单元素
我们在组件中声明表单元素时，一般都要为表单元素传入应用状态中的值，可以通过 state 也可以通过 props 传递，之后需要为其绑定相关事件，例如表单提交、输入改变等。在相关事件触发的处理函数中，我们需要根据表单元素中用户的输入，对应用数据进行相应的操作和改变: 
``` javascript
class ControlledInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
    }

    handlerChange = e => {
        this.setState({
            value: e.target.value
        });
    }

    render() {
        return (
            <div>
                <input type="text" value={this.state.value} onChange={this.handlerChange} />
            </div>
        );
    }

    //或者使用如下写法(属性初始化器语法)，我们通常建议在构造函数中绑定或使用属性初始化器语法来避免性能问题。
    handlerChange = e => {
        this.setState({
            value: e.target.value
        });
    }
    render() {
        return (
            <div>
                <input type="text" value={this.state.value} onChange={this.handlerChange} />
            </div>
        );
    }
}

ReactDOM.render(<ControlledInput />, document.getElementById('container'));
```

使用受控组件和非受控组件都是有相应的适用场景的，就拿 input 来讲，比方说它是一个搜索框，我们需要在应用中实现根据搜索框内容输入异步返回相关搜索建议的功能，那么此处的 input 就应该是受控组件。而假如它是 Todo 应用中用来添加新事项的输入框，我们就没有特别的理由需要实时获取其中的数据，只需要在添加事项的事件触发时获取输入框中的值即可，这个地方就可以使用非受控组件。

### 事件
React 元素的事件属性几乎与 HTML 中的事件相关属性相同，不过在 React 当中，事件相关的属性是以小驼峰的方式命名的。
新版本的 React 中，我们可以通过类和函数声明 React 组件，在这两种形式的声明当中，我们都可以为其定义事件处理函数，函数定义的组件只需要在其方法内部再定义事件触发的函数即可，而如果是类声明组件，就像我们在之前的课程中已经强调过的，类定义组件中的自定义方法默认是没有绑定 this 的，因此假如我们需要在事件处理函数中调用 this.setState 一类的方法，就必须要在构造函数中手动将 this 绑定在相应的事件处理函数上。(箭头函数不用)。

### 条件渲染
我们可以使用与运算符 && 进行条件渲染: 
``` javascript
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      <h1>Hello!</h1>
      {
        unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}

const messages = ['React', 'Re: React', 'Re:Re: React'];
ReactDOM.render(
  <Mailbox unreadMessages={messages} />,
  document.getElementById('root')
);
```

之所以能这样做，是因为在 JavaScript 中，true && expression 总是返回 expression，而 false && expression 总是返回 false。
因此，如果条件是 true，&& 右侧的元素就会被渲染，如果是 false，React 会忽略并跳过它。

### 阻止组件渲染
在极少数情况下，你可能希望隐藏组件，如下方法可以实现: 
``` javascript
render() {
  return false;
}

render() {
  return null;
}

render() {
  return [];
}

render() {
  return (<React.Fragment></React.Fragment>);
}

render() {
  return (<></>);
}
```

## 列表组件
***  
通常，我们使用 Javascript 中的 map() 方法遍历数组。对数组中的每个元素返回 li 标签，最后我们得到一个数组 listItems: 
``` javascript
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map(number =>
  (
    <li>{number}</li>
  )
);
```

我们把整个 listItems 插入到 ul 元素中，然后渲染进 DOM:
``` javascript
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

我们可以把前面的例子重构成一个组件。这个组件接收 numbers 数组作为参数，输出一个无序列表: 
``` javascript
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map(number =>
    (
      <li>{number}</li>
    )
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

当我们运行这段代码，将会看到一个警告 a key should be provided for list items，意思是当你创建一个元素时，必须包括一个特殊的 key 属性。我们来给每个列表元素分配一个 key 来解决上面的那个警告: 
``` javascript
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map(number =>
    (  
      <li key={number.toString()}>{number}</li>
    )
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

### Keys
Keys 可以在 DOM中 的某些元素被增加或删除的时候帮助 React 识别哪些元素发生了变化。因此你应当给数组中的每一个元素赋予一个确定的标识。
一个元素的 key 最好是这个元素在列表中拥有的一个独一无二的字符串。通常，我们使用来自数据的 id 作为元素的 key:
``` javascript
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

当元素没有确定的 id 时，你可以使用他的序列号索引 index 作为 key。如果列表可以重新排序，我们不建议使用索引来进行排序，因为这会导致渲染变得很慢。
注意: 如果你提取出一个 ListItem 组件，你应该把 key 保存在数组中的这个<ListItem />元素上，而不是放在 ListItem 组件中的 li 元素上: 
``` javascript
function ListItem(props) {
  // 对啦！这里不需要指定key:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // 又对啦！key应该在数组的上下文中被指定
    <ListItem key={number.toString()}
              value={number} />

  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

注意: 当你在 map() 方法的内部调用元素时，你最好随时记得为每一个元素加上一个独一无二的 key。
数组元素中使用的 key 在其兄弟之间应该是独一无二的。然而，它们不需要是全局唯一的。