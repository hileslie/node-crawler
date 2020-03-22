# node-crawler

## puppeteer

> https://zhaoqize.github.io/puppeteer-api-zh_CN/

### 请求拦截器

> page.on('requestfinished') 

## cheerio

## 数据库表设计

### 小说表 novel_info

| id  |  title  |  desc  |  author  |   type  |  tags |
| --- | ------- | ------ | -------- | ------- | ----- |
| int | varchar | varchar | varchar | varchar | varchar |
| 1   |   标题  |   简介   |   作者  | 小说类型 | 小说标签 |

### 章节表 novel_chapter

| id |  title  | novel_id | content_id | is_delete |  words | ctime | mtime |
| --- | ------ | -------- | ---------- | --------- | ----- | ------ | ------ |
| int | varchar |    int   | int | tinyint | int | timestamp | timestamp |
| 1   | 章节标题 |  对应小说表id  |   文章内容id,对应内容表id  | 删除标识 | 字数 | 创建时间 | 修改时间 |

### 内容表 novel_chapter_content

| id  | content |
| --- | ------- |
| int |   text  |
| 1   | 章节内容 |
