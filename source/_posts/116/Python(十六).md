---
title: Python(十六)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog116.jpg
date: 2019/05/17
---

接下来的几篇，我们将介绍一下最流行的爬虫框架 Scrapy。本篇，我们会介绍一下 Scrapy 的基本使用。
![](https://cdn.0xfee1dead.cn/contentImg/scrapy/scrapy_architecture_02.png)

## 基本命令
***  
``` bash
# scrapy startproject [文件夹名]
scrapy startproject quotetutorial

# 进入项目文件夹
cd quotetutorial

# scrapy genspider [项目名] [目标爬取网址]
scrapy genspider quotes quotes.toscrape.com

# scrapy crawl [项目名]
scrapy crawl quotes 

# scrapy crawl [项目名] -o [保存的文件名]
scrapy crawl quotes -o quotes.json
```

## Scrapy 中的 Selector
***  
scrapy 的 Selector 支持两种方式提取内容: 
1. xpath()
2. css()

xpath() 和 css() 的返回结果也是 Selector 对象列表，列表元素可以继续链式调用 xpath() 和 css()，获取 Selector 对象之后可以使用 get() 或 getall() 获取想要提取的内容或内容列表。
我个人更习惯 css() 方法: 
``` python
response.css('#images img::attr(src)').getall()
# ['image1_thumb.jpg', 'image2_thumb.jpg', 'image3_thumb.jpg', 'image4_thumb.jpg', 'image5_thumb.jpg']

response.css('a[href*=image]::attr(href)').getall()
# ['image1.html', 'image2.html', 'image3.html', 'image4.html', 'image5.html']

response.css('a[href*=image] img::attr()')
```

我们还可以使用 re() 或 re_first() 方法进行一些匹配字符串处理: 
``` python
response.css('a[href*=image]::text').getall()
# ['Name: My image 1 ', 'Name: My image 2 ', 'Name: My image 3 ', 'Name: My image 4 ', 'Name: My image 5 ']

response.css('a[href*=image]::text').re('Name\:(.*)')
# [' My image 1 ', ' My image 2 ', ' My image 3 ', ' My image 4 ', ' My image 5 ']
```

注意: 
- 我们可以使用 response.selector 获取 Selector 对象调用 xpath() 和 css()，也可以更方便的使用 response 对象直接调用 xpath() 和 css()
- 我们可能还见过 extract() 和 extract_first()，这两个方法虽然没有被废弃，但是还是不建议使用，因为 get()和 getall()方法的输出更具可预测性

## Scrapy 中的 Spider
***  
Spider 主要用来完成爬取逻辑和网页数据的解析: 
``` python
import scrapy
from quotetutorial.items import QuoteItem

class QuotesSpider(scrapy.Spider):
    name = 'quotes'
    allowed_domains = ['quotes.toscrape.com']
    start_urls = ['http://quotes.toscrape.com/']
    # 覆盖 settings.py 文件
    custom_settings = {
        'USER_AGENT': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
    }

    # parse 方法为默认的回调方法，通常使用 Selector 进行数据解析并返回 Item
    # 内部还可以使用 yield scrapy.Request() 方法返回多个 Request 
    def parse(self, response):
        quotes = response.css('.quote')
        for quote in quotes:
            item = QuoteItem()
            text = quote.css('.text::text').get()
            author = quote.css('.author::text').get()
            tags = quote.css('.tags .tag::text').getall()
            item['name'] = text
            item['author'] = author
            item['tags'] = tags
            yield item

        next = response.css('.pager .next a::attr(href)').get()
        url = response.urljoin(next)
        yield scrapy.Request(url=url, callback=self.parse)
```

Spider 还可以接收修改其行为的参数，在命令行可以使用 -a 参数: 
``` bash
scrapy crawl quotes -a category=electronics
```

在 Spider 的构造函数中可以接收该参数: 
``` python
import scrapy
from quotetutorial.items import QuoteItem

class QuotesSpider(scrapy.Spider):
    name = 'quotes'
    allowed_domains = ['quotes.toscrape.com']

    def __init__(self, category=None, *args, **kwargs):
        super(QuotesSpider, self).__init__(*args, **kwargs)
        self.start_urls = [f'http://quotes.toscrape.com/category={category}']

    def parse(self, response):
        pass
```

## Scrapy 中的 Item
***  
为了定义通用输出数据格式，Scrapy 提供了 Item 类。它们提供类似字典的 API，并具有用于声明其可用字段的方便语法: 
``` python
import scrapy

class QuoteItem(scrapy.Item):
    # define the fields for your item here like:
    name = scrapy.Field()
    author = scrapy.Field()
    tags = scrapy.Field()
```

## Scrapy 中的 Pipelinie
***  
Pipeline 可以对抓取下来的 Item 进行进一步处理: 
``` python
import pymongo
from scrapy.exceptions import DropItem

class TextPipeline(object):

    def __init__(self):
        self.limit = 50

    # process_item 返回 item 或 DropItem 对象
    def process_item(self, item, spider):
        if item['name']:
            if len(item['name']) > self.limit:
                item['name'] = item['name'][0:self.limit] + '...'
            return item
        else:
            return DropItem('Missing Text')


class MongoPipeline(object):

    def __init__(self, mongo_uri, mongo_db):
        self.mongo_uri = mongo_uri
        self.mongo_db = mongo_db

    @classmethod
    def from_crawler(cls, crawler):
        return cls(
            mongo_db = crawler.settings.get('MONGO_DB'),
            mongo_uri = crawler.settings.get('MONGO_URI')
        )

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(self.mongo_uri)
        self.db = self.client[self.mongo_db]

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        name = item.__class__.__name__
        self.db[name].insert(dict(item))
        return item
```

## Scrapy 中的 Settings
***  
settings.py 为 Scrapy 中的配置文件，进行项目的配置工作: 
``` python
# Obey robots.txt rules
ROBOTSTXT_OBEY = True

# 配置变量
MONGO_DB = 'quotetutorial'
MONGO_URI = 'localhost'

# user-agent
USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'

# Override the default request headers
DEFAULT_REQUEST_HEADERS = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en'
}

# Configure item pipelines
# 管道优先级范围 0 - 1000，数字越小，优先级越高
ITEM_PIPELINES = {
   'quotetutorial.pipelines.TextPipeline': 300,
   'quotetutorial.pipelines.MongoPipeline': 400
}

# Enable or disable downloader middlewares
# 可以在这个配置中关闭不需要的默认中间件
DOWNLOADER_MIDDLEWARES = {
    'httpbintest.middlewares.ProxyMiddleware': 100,
    'scrapy.downloadermiddlewares.useragent.UserAgentMiddleware': None,
    'scrapy.downloadermiddlewares.retry.RetryMiddleware': None
}
```

## Scrapy 中的 Downloader Middleware
***  
``` python
class ProxyMiddleware(object):

    # Called for each request that goes through the downloader
    # middleware.

    # Must either:
    # - return None: continue processing this request
    # - or return a Response object
    # - or return a Request object
    # - or raise IgnoreRequest: process_exception() methods of
    #   installed downloader middleware will be called
    def process_request(self, request, spider):
        spider.logger.info('Using Proxy')
        request.meta['proxy'] = 'https://46.10.240.182:55878'
        return None


    # Called with the response returned from the downloader.

    # Must either;
    # - return a Response object
    # - return a Request object
    # - or raise IgnoreRequest
    def process_response(self, request, response, spider):
        response.status = 201
        return response

    # Called when a download handler or a process_request()
    # (from other downloader middleware) raises an exception.

    # Must either:
    # - return None: continue processing this exception
    # - return a Response object: stops process_exception() chain
    # - return a Request object: stops process_exception() chain
    def process_exception(self, request, exception, spider):
        spider.logger.debug('Get Exception')
        return request
```