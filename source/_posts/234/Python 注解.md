---
title: Python 注解
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog234.jpg
date: 2022/03/20
---

从 Python 3.6 开始，我们可以使用 typing 的模块对变量进行类型注解。可以选择在代码中特定位置包含类型信息。
声明变量类型的语法如下:  
``` python
variable_name: type
```

在函数中，使用如下方式声明返回类型: 
``` python
def function_name(param: type)-> return_type:
```

除了基本类型，typing 模块还提供容器类型，例如 Dict、List、Set 或者 Tuple。
``` python
from typing import Dict, List, Tuple

primes: List[int] = [2,3,5,7,11,13]

primes_dict: Dict[str, int] = {
    "two": 2,
    "three": 3,
    "five": 5,
    "seven": 7,
    "eleven": 11,
    "thirteen": 13
}

isPrime_tuple: Tuple[str, int, bool] = ("one", 1, False)
```

还可以通过组合原始类型来定义自己的类型: 
``` python
from typing import Tuple

Vector = Tuple[float,float,float]

vector: Vector = (1.0,1.0,1.0)

Matrix = Tuple[Vector,Vector,Vector]
matrix: Matrix = (
    (1.0,0.0,0.0),
    (0.0,1.0,0.0),
    (0.0,0.0,1.0)
)
```

如果想声明一个接受多种类型参数的函数，可以使用 Any: 
``` python
from typing import Any

def whatIsMyType(param: Any):
    return type(param)

print(whatIsMyType(42))

print(whatIsMyType("42"))
```