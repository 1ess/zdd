---
title: Nginx(五)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog129.jpg
date: 2019/09/25
---

本篇，我们来介绍一下 nginx.conf 中的压缩配置 —— gzip。

在 Nginx 配置文件中可以配置 gzip 的使用，相关指令可以在配置文件的 http 块、server 块或者 location 块中设置。

## gzip 基本指令
***  
### gzip
该指令用于开启或关闭 gzip 功能，语法为: 
``` nginx
gzip on | off;
```

默认情况下，该指令为 off，即不启用 gzip 功能。

### gzip_buffer
该指令用于设置 gzip 压缩文件使用的缓冲空间大小，语法为: 
``` nginx
gzip_buffer {number} {size};
```

其中，number 为缓冲空间的个数，size 为每个缓冲空间的大小。默认情况下，number * size 为 128: 
``` nginx
gzip_buffer 32 4K | 16 8K;
```

### gzip_comp_level
该指令用于设置压缩程度，级别范围是 1 到 9，级别 1 表示压缩程度最高，压缩效率最低，最费时间。语法结构为: 
``` nginx
gzip_comp_level {level};
```

gzip 的默认压缩级别为 1。

### gzip_min_length
gzip 功能对大数据的压缩效果明显，但是如果数据很小，可能出现越压缩数据越大的情况。因此，应根据响应的大小选择性开启 gzip 功能。该指令设置响应字节数，当响应字节数大于该值时，才启用 gzip 压缩。
``` nginx
gzip_min_length {length};
```

默认设置为 20，我们一般设置为 1K 以上: 
``` nginx
gzip_min_length 1024;
```

### gzip_types
Nginx 服务器可以根据响应的 MIME 类型选择性地开启 gzip 功能，语法为: 
``` nginx
gzip_types {mime_type} ...;
```

默认 mime_type 变量为 text/html，我们可以设置为 *，表示对所有的数据开启 gzip，我们一般设置为: 
``` nginx
gzip_types text/plain application/x-javascript text/css text/html application/xml;
```

### gzip_vary
该指令用于设置使用 gzip 功能时，是否发送带有 accept-encoding 的响应字段: 
``` nginx
gzip_vary on | off;
```

gzip_vary 的默认配置为 off。