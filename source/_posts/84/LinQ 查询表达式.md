---
title: LinQ 查询表达式
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog84.jpg
date: 2018/12/10
---

最近的工作是对一个复杂数据库进行操作，模型类之间的关系很复杂。操作方式使用了 LINQ，之前一直对 LINQ 的查询语法不太喜欢，这次使用之后，感觉比方法语法更容易接受，因此详细总结一下查询表达式的语法。

数据查询历来都表示为简单的字符串，没有编译时类型检查。 此外，对于每种数据源，还需要学习不同的查询语言: SQL 数据库、XML 文档以及各种 Web 服务等。借助 LINQ，查询成为了最高级的语言构造，就像类、方法和事件一样。

LINQ 最明显的"语言集成"部分就是查询表达式。 使用相同的基本查询表达式模式来查询和转换 SQL 数据库、ADO .NET 数据集、XML 文档以及 .NET 集合中的数据。
从应用程序的角度来看，原始源数据的特定类型和结构并不重要。应用程序始终将源数据视为 IEnumerable<T> 或 IQueryable<T> 集合。 

对于源序列，查询可能会执行三种操作之一: 
- 检索元素的子集以生成新序列，而不修改各个元素

``` csharp
// scores 是 int[]
IEnumerable<int> highScoresQuery =
    from score in scores
    where score > 80
    orderby score descending
    select score;
```
- 将序列转换为新类型的对象

``` csharp
IEnumerable<string> highScoresQuery2 =
    from score in scores
    where score > 80
    orderby score descending
    select $"The score is {score}";
```
- 检索有关源数据的单独值

``` csharp
int highScoreCount =
    (from score in scores
     where score > 80
     select score)
     .Count();
```

### 查询表达式是什么
查询表达式是以查询语法表示的查询。 

### 规则
查询表达式必须以 from 子句开头，且必须以 select 或 group 子句结尾。 在第一个 from 子句与最后一个 select 或 group 子句之间，可以包含以下这些可选子句中的一个或多个: where、orderby、join、let 甚至是其他 from 子句。 还可以使用 into 关键字，使 join 或 group 子句的结果可以充当相同查询表达式中的其他查询子句的源。

### 查询变量
在 LINQ 中，查询变量是存储查询而不是查询结果的任何变量。
``` csharp
// Query Expression.
    IEnumerable<int> scoreQuery = //query variable
        from score in scores //required
        where score > 80 // optional
        orderby score descending // optional
        select score; //must end with select or group
```

上面的示例中，scoreQuery 是查询变量，它有时仅仅称为查询。 

查询变量可以存储采用查询语法、方法语法或是两者的组合进行表示的查询。
``` csharp
//Query syntax
IEnumerable<City> queryMajorCities =
    from city in cities
    where city.Population > 100000
    select city;

// Method-based syntax
IEnumerable<City> queryMajorCities2 = cities.Where(c => c.Population > 100000);
```

### 开始查询表达式
查询表达式必须以 from 子句开头，它指定数据源以及范围变量，范围变量表示遍历源序列时，源序列中的每个连续元素。范围变量基于数据源中元素的类型进行强类型化。
因为范围变量是强类型，所以可以使用点运算符访问该类型的任何可用成员。
``` csharp
IEnumerable<Country> countryAreaQuery =
    from country in countries
    where country.Area > 500000 //sq km
    select country;
```

查询表达式可能会包含多个 from 子句。在源序列中的每个元素本身是集合或包含集合时，可使用其他 from 子句。 
``` csharp
IEnumerable<City> cityQuery =
    from country in countries
    from city in country.Cities
    where city.Population > 10000
    select city;
```

### 结束查询表达式
查询表达式必须以 group 子句或 select 子句结尾。

#### group 子句
使用 group 子句可生成按指定键组织的组的序列。键可以是任何数据类型。
``` csharp
var queryCountryGroups =
    from country in countries
    group country by country.Name[0];
```

#### select 子句
使用 select 子句可生成所有其他类型的序列。简单 select 子句只生成类型与数据源中包含的对象相同的对象的序列。
``` csharp
IEnumerable<Country> sortedQuery =
    from country in countries
    orderby country.Area
    select country;
```

select 子句可以用于将源数据转换为新类型的序列，此转换也称为投影。
请注意，新对象使用对象初始值设定项进行初始化。
``` csharp
// Here var is required because the query
// produces an anonymous type.
var queryNameAndPop =
    from country in countries
    select new { Name = country.Name, Pop = country.Population };
```

### 使用 into 进行延续
可以在 select 或 group 子句中使用 into 关键字创建存储查询的临时标识符。
``` csharp
// percentileQuery is an IEnumerable<IGrouping<int, Country>>
var percentileQuery =
    from country in countries
    let percentile = (int) country.Population / 10_000_000
    group country by percentile into countryGroup
    where countryGroup.Key >= 20
    orderby countryGroup.Key
    select countryGroup;
```

### 筛选、排序和联接
在开头 from 子句与结尾 select 或 group 子句之间，所有其他子句(where、join、orderby、from、let)都是可选的。任何可选子句都可以在查询正文中使用零次或多次。

#### where 子句
使用 where 子句可基于一个或多个谓词表达式，从源数据中筛选出元素。
``` csharp
IEnumerable<City> queryCityPop =
    from city in cities
    where city.Population < 200000 && city.Population > 100000
    select city;
```

#### orderby 子句
使用 orderby 子句可按升序或降序对结果进行排序。还可以指定次要排序顺序。
``` csharp
IEnumerable<Country> querySortedCountries =
    from country in countries
    orderby country.Area, country.Population descending
    select country;
```

注意: ascending 关键字是可选的，如果未指定任何顺序，则它是默认排序顺序。

#### join 子句
使用 join 子句可基于每个元素中指定的键之间的相等比较，将一个数据源中的元素与另一个数据源中的元素进行关联和/或合并。在 LINQ 中，联接操作是对元素属于不同类型的对象序列执行。联接了两个序列之后，必须使用 select 或 group 语句指定要存储在输出序列中的元素，还可以使用匿名类型将每组关联元素中的属性合并到输出序列的新类型中。
``` csharp
var categoryQuery =
    from cat in categories
    join prod in products on cat equals prod.Category
    select new { Category = cat, Name = prod.Name };
```

还可以通过使用 into 关键字将 join 操作的结果存储到临时变量中来执行分组联接。 

#### let 子句
使用 let 子句可将表达式(如方法调用)的结果存储在新范围变量中。 
``` csharp
string[] names = { "Svetlana Omelchenko", "Claire O'Donnell", "Sven Mortensen", "Cesar Garcia" };
IEnumerable<string> queryFirstNames =
    from name in names
    let firstName = name.Split(' ')[0]
    select firstName;
```

### 查询表达式中的子查询
查询子句本身可能包含查询表达式，这有时称为子查询。每个子查询都以自己的 from 子句开头，该子句不一定指向第一个 from 子句中的相同数据源。 
``` csharp
var queryGroupMax =
    from student in students
    group student by student.GradeLevel into studentGroup
    select new
    {
        Level = studentGroup.Key,
        HighestScore =
            (from student2 in studentGroup
             select student2.Scores.Average())
             .Max()
    };
```