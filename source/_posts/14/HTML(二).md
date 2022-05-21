---
title: HTML(二)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog14.jpg
date: 2018/06/16
---

上一篇讲了 HTML 中 head 部分重要的子元素，本篇将要讲解 body 元素中所有重要的子元素。

## h 元素(heading，h1 ~ h6)
***  
h1 ~ h6 是各个区块的标题，根据表示数字不同，显示的字体大小，代表的意思也各不相同。
我们应根据页面的情况，合理使用不同大小的标题。
``` HTML
<h1>1级标题</h1>
```
``` HTML
<h2>2级标题</h2>
``` 
``` HTML
<h3>3级标题</h3>
``` 
``` HTML
<h4>4级标题</h4>
```
``` HTML
<h5>5级标题</h5>
``` 
``` HTML
<h6>6级标题</h6>
``` 

## p 元素(paragraph)
***  
p 标记表示文章自然段。
``` HTML
<p>段落</p>
``` 

## br 元素
***  
br 元素在文本中生成一个换行(回车)符号。  
``` HTML
<br>
``` 

## hr 元素
***  
hr 元素表示段落级元素之间的主题转换。在 HTML 的早期版本中，它是一个水平线。现在它仍能在可视化浏览器中表现为水平线，但目前被定义为语义上的，而不是表现层面上。
``` HTML
<hr>
``` 

## 文本格式化元素
***  
### b 元素(Blod)
``` HTML
<b>Blod text</b>
``` 

### i 元素(Italic)
``` HTML
<i>Italic text</i>
``` 

### strong 元素(Strong)
``` HTML
<strong>Important text</strong>
``` 

### em 元素(Emphasize)
``` HTML
<em>Emphasize text</em>
``` 

**注意: 虽然 strong 元素和 b 元素，em 元素和 i 元素在浏览器中的表现相同，但是语义不同。**

### del 元素(Deleted)
``` HTML
<del>Deleted text</del>
``` 

### ins 元素(Inserted)
``` HTML
<ins>Inserted text</ins>
``` 

### s 元素(Strikethrough)
``` HTML
<s>Strikethrough text</s>
``` 

### u 元素(Underlined)
``` HTML
<u>Underlined text</u>
``` 

**注意: 虽然 del 元素和 s 元素，ins 元素和 u 元素在浏览器中的表现相同，但是语义不同。并且 s 元素和 u 元素已经在 HTML5 规范中被取消。**

### small 元素(Smaller)
``` HTML
<small>Small text</small>
``` 

### mark 元素(Marked)
``` HTML
<mark>Marked text</mark>
``` 

### pre 元素(Preformatted)
pre 标记会显示格式化后的文本，包围在 pre 标记内的文本会保留空格和换行，而文本也以等宽字体来显示。
通常，浏览器会按下面规则表示自然段内的内容: 
1. 连续的半角空格会被压缩为一个半角空格
2. Tab 会被压缩为一个半角空格
3. 换行会被压缩为一个半角空格
4. 自然段内文本会根据浏览器宽度自动换行显示

但在 pre 标记内，以上规则全都无效。
``` HTML
<pre>
    把酒祝东风，且共从容，垂杨紫陌洛城东。总是当时携手处，游遍芳丛。
    聚散苦匆匆，此恨无穷。今年花胜去年红。可惜明年花更好，知与谁同？
</pre>
``` 

### code 元素(Code)
code 标记是计算机语言代码的描述，如果页面内有程序源代码，应使用 code 标记。与 pre 标记配合使用。
根据程序语言不同，我们可以为 code 添加不同的 language-xxx 的 class 属性。
``` HTML
<pre>
    <code class="language-javascript">
           var s = "Hello World!";
           var i = 1;
           if (i == 1) {
               alert(s);
           }
        </code>
</pre>
``` 

### q 元素(Short quotation)
q 标记表示语句的引用。浏览器会自动加上双引号。
注意: 引用段落时，请使用 blockquote 标记
常用属性: cite 表示引用出处。如果是网站，则值为 URL，如果是书籍，则值为 ISBN。
``` HTML
<q cite="https://baike.baidu.com/item/%E4%BA%8E%E6%88%91%E5%BF%83%E6%9C%89%E6%88%9A%E6%88%9A%E7%84%89">于我心有戚戚焉</q>
```

### blockquote 元素(Long quotation)
blockquote 标记是以自然段为单位的引用。
常用属性: cite 表示引用出处。如果是网站，则值为 URL，如果是书籍，则值为 ISBN。
``` HTML
<blockquote cite="https://baike.baidu.com/item/%E9%BD%90%E6%A1%93%E6%99%8B%E6%96%87%E4%B9%8B%E4%BA%8B/7336481">
    <p>王说，曰: "云: '他人有心，予忖度之。'──夫子之谓也。夫我乃行之，反而求之，不得吾心；夫子言之，于我心有戚戚焉。"此心之所以合于王者，何也？"</p>
    <p>曰: "有复于王者曰: '吾力足以举百钧'，而不足以举一羽；'明足以察秋毫之末'，而不见舆薪，则王许之乎？"</p>
    <p>曰: "否。"</p>
</blockquote>
```

### cite 元素(Citation)
cite 标记表示书籍，电影，音乐等标题，出处。
``` HTML
<blockquote cite="urn:isbn:1234567890">
        <p><cite>Head First HTML And CSS</cite>是一本好书！</p>
</blockquote>
```

### dfn 元素(Define)
dfn 标记表示短语定义，用于专有名词。
- 如果 dfn 有 title 属性，则该属性值表示短语的定义
- 如果 dfn 内有 abbr 标记，且 abbr 有 title 属性，则该属性值表示短语的定义

``` HTML
<dfn title="服务器软件">Apache</dfn> 是最流行的 web 服务器。
```

### abbr 元素(Abbreviation)
abbr 标记表示缩略语，与 dfn 配合使用。
``` HTML
I Love <dfn><abbr title="Hyper-Text Markup Language">HTML</abbr></dfn>。
```