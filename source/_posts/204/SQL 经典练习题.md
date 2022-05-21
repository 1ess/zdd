---
title: SQL 经典练习题
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog204.jpg
date: 2022-02-10
---

### 数据准备
1.学生表
2.课程表
3.教师表
4.成绩表

``` sql
-- 建表
-- 学生表
CREATE TABLE `Student`(
`s_id` VARCHAR(20),
`s_name` VARCHAR(20) NOT NULL DEFAULT '',
`s_birth` VARCHAR(20) NOT NULL DEFAULT '',
`s_sex` VARCHAR(10) NOT NULL DEFAULT '',
PRIMARY KEY(`s_id`)
);
-- 课程表
CREATE TABLE `Course`(
`c_id` VARCHAR(20),
`c_name` VARCHAR(20) NOT NULL DEFAULT '',
`t_id` VARCHAR(20) NOT NULL,
PRIMARY KEY(`c_id`)
);
-- 教师表
CREATE TABLE `Teacher`(
`t_id` VARCHAR(20),
`t_name` VARCHAR(20) NOT NULL DEFAULT '',
PRIMARY KEY(`t_id`)
);
-- 成绩表
CREATE TABLE `Score`(
`s_id` VARCHAR(20),
`c_id` VARCHAR(20),
`s_score` INT(3),
PRIMARY KEY(`s_id`,`c_id`)
);
-- 插入学生表测试数据
insert into Student values('01' , '赵雷' , '1990-01-01' , '男');
insert into Student values('02' , '钱电' , '1990-12-21' , '男');
insert into Student values('03' , '孙风' , '1990-05-20' , '男');
insert into Student values('04' , '李云' , '1990-08-06' , '男');
insert into Student values('05' , '周梅' , '1991-12-01' , '女');
insert into Student values('06' , '吴兰' , '1992-03-01' , '女');
insert into Student values('07' , '郑竹' , '1989-07-01' , '女');
insert into Student values('08' , '王菊' , '1990-01-20' , '女');
-- 课程表测试数据
insert into Course values('01' , '语文' , '02');
insert into Course values('02' , '数学' , '01');
insert into Course values('03' , '英语' , '03');

-- 教师表测试数据
insert into Teacher values('01' , '张三');
insert into Teacher values('02' , '李四');
insert into Teacher values('03' , '王五');

-- 成绩表测试数据
insert into Score values('01' , '01' , 80);
insert into Score values('01' , '02' , 90);
insert into Score values('01' , '03' , 99);
insert into Score values('02' , '01' , 70);
insert into Score values('02' , '02' , 60);
insert into Score values('02' , '03' , 80);
insert into Score values('03' , '01' , 80);
insert into Score values('03' , '02' , 80);
insert into Score values('03' , '03' , 80);
insert into Score values('04' , '01' , 50);
insert into Score values('04' , '02' , 30);
insert into Score values('04' , '03' , 20);
insert into Score values('05' , '01' , 76);
insert into Score values('05' , '02' , 87);
insert into Score values('06' , '01' , 31);
insert into Score values('06' , '03' , 34);
insert into Score values('07' , '02' , 89);
insert into Score values('07' , '03' , 98);
```

### 题目
1. 查询"01"课程比"02"课程成绩高的学生的信息及课程分数(如果没有成绩，则不算)

``` sql
select 
	st.*, 
	sc1.s_score as '01', 
	sc2.s_score as '02'
from Student st
left join Score sc1 
	on st.s_id=sc1.s_id and sc1.c_id='01'
left join Score sc2 
	on st.s_id=sc2.s_id and sc2.c_id='02'
where sc1.s_score > sc2.s_score
```

2. 查询"01"课程比"02"课程成绩低的学生的信息及课程分数(如果没有成绩，则不算)

``` sql
select 
	st.*, 
	sc1.s_score as '01', 
	sc2.s_score as '02'
from Student st
left join Score sc1 
	on st.s_id=sc1.s_id and sc1.c_id='01'
left join Score sc2 
	on st.s_id=sc2.s_id and sc2.c_id='02'
where sc1.s_score < sc2.s_score
```

3. 查询平均成绩大于等于 60 分的同学的学生编号和学生姓名和平均成绩

``` sql
select 
	st.s_id, 
	st.s_name, 
	round(avg(sc.s_score))
from Student st
left join Score sc 
	on st.s_id=sc.s_id
group by st.s_id
having avg(sc.s_score) > 60
```

4. 查询平均成绩小于 60 分的同学的学生编号和学生姓名和平均成绩(包括有成绩的和无成绩的)

``` sql
select 
	st.s_id, 
	st.s_name, 
	round(avg(sc.s_score))
from Student st
left join Score sc 
	on st.s_id=sc.s_id
group by st.s_id
having avg(sc.s_score) < 60 or avg(sc.s_score) is null
```

5. 查询所有同学的学生编号、学生姓名、考试总数、所有课程的总成绩(总成绩为空，显示 0)

``` sql
select 
	st.s_id,
	st.s_name,
 	count(sc.c_id) as sc_count,
	sum(
        case when sc.s_score is not null 
            then sc.s_score 
            else 0 
        end) as sc_total_score
from Student st
left join Score sc
	on st.s_id=sc.s_id
group by st.s_id
```

6. 查询"李"姓老师的数量

``` sql
select count(t_id) as count from Teacher where t_name like '李%'
```

7. 查询学过"张三"老师授课的同学的信息

``` sql
select st.* from Student st
left join Score sc
	on st.s_id=sc.s_id
left join Course c
	on sc.c_id=c.c_id
left join Teacher t
	on c.t_id=t.t_id
where t.t_name='张三'
```

8. 查询没学过"张三"老师授课的同学的信息

``` sql
select * from Student 
where s_id not in (
select st.s_id from Student st
left join Score sc
	on st.s_id=sc.s_id
left join Course c
	on sc.c_id=c.c_id
left join Teacher t
	on c.t_id=t.t_id
where t.t_name='张三'
)
```

9. 查询学过编号为"01"并且也学过编号为"02"的课程的同学的信息

``` sql
select st.* from Student st
left join Score sc 
	on st.s_id=sc.s_id and sc.c_id='01'
left join Score sc2
	on st.s_id=sc2.s_id and sc2.c_id='02'
where sc.c_id is not null and sc2.c_id is not null
```

10. 查询学过编号为"01"但是没有学过编号为"02"的课程的同学的信息

``` sql
select st.* from Student st
left join Score sc 
	on st.s_id=sc.s_id and sc.c_id='01'
left join Score sc2
	on st.s_id=sc2.s_id and sc2.c_id='02'
where sc.c_id is not null and sc2.c_id is null
```

11. 查询没有学全所有课程的同学的信息

``` sql
select st.* from Student st
left join Score sc 
	on st.s_id=sc.s_id and sc.c_id='01'
left join Score sc2
	on st.s_id=sc2.s_id and sc2.c_id='02'
left join Score sc3
	on st.s_id=sc3.s_id and sc3.c_id='03'
where sc.c_id is  null or sc2.c_id is null or sc3.c_id is null
``` 

12. 查询至少有一门课与学号为"01"的同学所学相同的同学的信息

``` sql
select distinct st2.* from Student st2
left join Score sc2
	on st2.s_id=sc2.s_id
where sc2.c_id in (
	select sc.c_id from Student st
	left join Score sc 
		on st.s_id=sc.s_id 
	where st.s_id='01'
) and st2.s_id != '01'
```

13. 查询和"01"号的同学学习的课程完全相同的其他同学的信息

``` sql
select st2.s_id  from Student st2
left join Score sc2
	on st2.s_id=sc2.s_id
where st2.s_id != '01'
group by st2.s_id
having GROUP_CONCAT(sc2.c_id) = 
(
	select GROUP_CONCAT(sc.c_id) from Student st
	left join Score sc 
		on st.s_id=sc.s_id 
	where st.s_id='01'
	GROUP BY st.s_id
)
```

14. 查询没学过"张三"老师讲授的任一门课程的学生姓名

``` sql
select st2.s_name from  Student st2
where st2.s_name not in (
select st.s_name from Student st
left join Score sc
	on st.s_id=sc.s_id
left join Course c
	on sc.c_id=c.c_id
left join Teacher t
	on c.t_id=t.t_id
	WHERE t.t_name='张三'
GROUP BY st.s_name
)
```

15. 查询两门及其以上不及格课程的同学的学号，姓名及其平均成绩

``` sql
select st.s_id, st.s_name, avg(sc.s_score) from Student st
left join Score sc
	on st.s_id=sc.s_id
where sc.s_score < 60
group by st.s_id, st.s_name
having count(sc.s_score) >= 2
```

16. 检索"01"课程分数小于 60，按分数降序排列的学生信息

``` sql
select st.* from Student st
left join Score sc
	on sc.s_id=st.s_id
where sc.s_score < 60 and sc.c_id='01'
order by sc.s_score desc
```

17. 按平均成绩从高到低显示所有学生的所有课程的成绩以及平均成绩

``` sql
select st.s_name, 
	sum(case when sc.c_id='01' then sc.s_score else 0 end) as c_01,
	sum(case when sc.c_id='02' then sc.s_score else 0 end) as c_02,
	sum(case when sc.c_id='03' then sc.s_score else 0 end) as c_03,
	avg(sc.s_score) as avg
from Score sc
left join Student st
	on st.s_id=sc.s_id
group by st.s_name
```

18. 查询各科成绩最高分、最低分和平均分：以如下形式显示: 课程ID、课程name、最高分、最低分、平均分、及格率、中等率、优良率、优秀率(及格为>=60，中等为 70-80，优良为 80-90，优秀为>=90)

``` sql
select 
	c.c_id, 
	c.c_name, 
	max(sc.s_score), 
	min(sc.s_score), 
	avg(sc.s_score), 
	(select count(1) from Score where c_id=c.c_id and s_score >= 60) * 100/ 
	(select count(1) from Score where c_id=c.c_id),
	(select count(1) from Score where c_id=c.c_id and s_score >= 70 and s_score < 80) * 100/ 
	(select count(1) from Score where c_id=c.c_id),
	(select count(1) from Score where c_id=c.c_id and s_score >= 80 and s_score < 90) * 100/ 
	(select count(1) from Score where c_id=c.c_id),
	(select count(1) from Score where c_id=c.c_id and s_score >= 90) * 100/ 
	(select count(1) from Score where c_id=c.c_id)
from Course c
left join Score sc
	on sc.c_id=c.c_id
group by c.c_id, c.c_name;
```

19. 查询学生的总成绩并进行排名

``` sql
select 
	st.s_name, 
	case when sum(sc.s_score) is null then 0 else sum(sc.s_score) end as sum 
from Student st
left join Score sc
	on sc.s_id=st.s_id
group by st.s_name
order by sum(sc.s_score) desc
```

20. 查询不同老师所教不同课程平均分从高到低显示

``` sql
select t.t_name, c.c_name, avg(sc.s_score) 
from Teacher t
left join Course c
	on c.t_id=t.t_id
left join Score sc
	on sc.c_id=c.c_id
group by t.t_name, c.c_name
order by avg(sc.s_score) desc
```

21. 统计各科成绩各分数段人数: 课程编号、课程名称、[100-85]、[85-70]、[70-60]、[0-60] 及所占百分比

``` sql
select 
	c.c_id, 
	c.c_name, 
	(select count(1) from Score sc where sc.c_id=c.c_id and sc.s_score <= 100 and sc.s_score > 85) as '100-85',
	(select count(1) from Score sc where sc.c_id=c.c_id and sc.s_score <= 85 and sc.s_score > 70) as '85-70',
	(select count(1) from Score sc where sc.c_id=c.c_id and sc.s_score <= 70 and sc.s_score > 60) as '70-60',
	(select count(1) from Score sc where sc.c_id=c.c_id and sc.s_score <= 60 and sc.s_score >= 0) as '0-60'
from Course c
```

22. 查询每门课程被选修的学生数

``` sql
select 
	c.c_id,
	count(1)
from Course c
left join Score sc
	on sc.c_id=c.c_id
left join Student st
	on st.s_id=sc.s_id
group by c.c_id
```

23. 查询出只有两门课程的全部学生的学号和姓名

``` sql
select st.s_id, st.s_name from Student st
left join Score sc
	on sc.s_id=st.s_id
group by st.s_id, st.s_name
having count(sc.c_id) = 2
```

24. 查询男生、女生人数

``` sql
select s_sex, count(1) from Student group by s_sex 
```

25. 查询名字中含有"风"字的学生信息

``` sql
select * from Student where s_name like '%风%'
```

26. 查询同名同性学生名单，并统计同名人数

``` sql
select 
	st.s_name, 
	count(1) 
from Student st
group by st.s_name
having count(st.s_name) > 1
```

27. 查询 1990 年出生的学生名单

``` sql
select * from Student where s_birth like '1990%'
```

28. 查询每门课程的平均成绩，结果按平均成绩降序排列，平均成绩相同时，按课程编号升序排列

``` sql
select c.c_id, c.c_name, avg(sc.s_score) from Course c
left join Score sc
	on sc.c_id=c.c_id
group by c.c_id, c.c_name
order by avg(sc.s_score) desc, c.c_id asc
```

29. 查询平均成绩大于等于 85 的所有学生的学号、姓名和平均成绩

``` sql
select st.s_id, st.s_name, avg(sc.s_score) from Student st
left join Score sc
	on sc.s_id=st.s_id
group by st.s_id, st.s_name
having avg(sc.s_score) >= 85
```

30. 查询课程名称为"数学"，且分数低于 60 的学生姓名和分数

``` sql
select st.s_name, sc.s_score from Student st
left join Score sc
	on sc.s_id=st.s_id
left join Course c
	on c.c_id=sc.c_id
where c.c_name='数学'
and sc.s_score < 60
```