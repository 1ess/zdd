---
title: 重学 SQL(八)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog163.jpg
date: 2020/08/23
---

本篇，我们来介绍一下 MySQL 支持的数据类型，了解这些类型，以及确定何时使用哪种类型是非常重要的。

### String Type
字符串类别有一堆数据类型，最常见的有 CHAR(x) 和 VARCHAR(x)。我们使用 CHAR(x) 存储固定长度字符串，VARCHAR(x) 存储变长字符串。
VARCHAR(x) 最大长度为 65535 characters，也就是大约 64KB。
如果要存储比较长的字符串，我们可以使用 MEDIUMTEXT，最大存储空间为 16MB。对于存储 JSON 字符串，SCV 字符串都是不错的选择。
如果想存储长文本字符串，我们可以使用 LONGTEXT，最大存储空间为 4GB。
除此之外，还有 TINYTEXT，可以存储 255 characters，TEXT 与 VARCHAR(x) 最大存储空间一样。

注意: 对于 TEXT 和 VARCHAR(x) 我们优先使用 VARCHAR(x)，因为其可以编入索引。
### Numeric Type
#### Integer Type
MySQL 中有 5 种整数类型: 

| Type             | Range      |
|------------------|------------|
| TINYINT          | -128 ~ 127 |
| UNSIGNED TINYINT | 0 ~ 255    |
| SMALLINT         | -32K ~ 32K |
| MEDIUMYINT       | -8M ~ 8M   |
| INT              | -2G ~ 2G   |
| BIGINT           | -9Z ~ 9Z   |


#### Fixed-point And Float-point Type
MySQL 中最常用的存储浮点数的类型为 DECIMAL(p, s)。
其中，s 代表小数位数，p - s 代表整数位数，p 的范围是 1 到 65。

MySQL 中还有 FLOAT 和 DOUBLE 类型，但是他们存储的都不是精确数字，因此只有存储不需要特别精确的数字时才使用这两种类型。

#### Boolean
有时我们可能会想要存储 TRUE/FALSE，比如，文章是否已发布，我们可以使用 BOOLEAN 类型。
``` sql
UPDATE posts
SET is_published = 1 -- or TRUE
```

#### Enum And Set Type
有时，我们想限制存储在某列的字符串，比如，衣服尺寸只能存储 Small/Medium/Large，这时，我们就可以使用 ENUM 类型。
定义语法为:
``` sql
ENUM('small', 'medium', 'large')
```

我们通常要避免使用这一类型，可以单独建表来代替 ENUM。

### Date And Time Type
MySQL 有 4 种 Date/Time 类型: 
- DATE: 存储日期，没有时间组件
- TIME: 存储时间，没有日期组件
- DATETIME: 占据 8 字节，表示形式为 yyyy-mm-dd hh:mm:ss
- TIMESTAMP: 占据 4 字节，表示形式为 yyyy-mm-dd hh:mm:ss

对于 TIMESTAMP 来说，如果储存时的时区和检索时的时区不一样，那么查询出来的数据也不一样。
对于 DATETIME 来说，储存是什么，那么查询出来的数据也是什么。

### Blob Type
我们如果想存储二进制数据如图片，视频等，我们可以使用二进制类型。
MySQL 中有 4 种二进制类型: 

| Type        | Range |
|-------------|-------|
| TINYBLOB    | 255B  |
| BLOB        | 165KB |
| MEDIUMYBLOB | 16MB  |
| LONGBLOB    | 4GB   |

直接把文件存储到数据库会有很多问题: 
- 增长数据库大小
- 备份很慢
- 性能问题

所以通常不直接使用二进制类型在数据库存储文件。