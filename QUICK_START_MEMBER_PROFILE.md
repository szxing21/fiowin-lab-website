# 成员个人主页功能 - 快速开始指南

## 第一步：运行数据库迁移

如果您已经有运行中的数据库，需要执行以下迁移来添加新字段：

```bash
# 方式1: 使用MySQL命令行
mysql -u your_username -p your_database < drizzle/0003_add_member_personal_page_fields.sql

# 方式2: 如果使用drizzle-kit（需要配置DATABASE_URL环境变量）
pnpm db:push
```

迁移将为 `members` 表添加以下字段：
- `education` - 教育经历
- `workExperience` - 工作经历
- `projects` - 项目经历
- `researchAreas` - 研究方向
- `personalWebsite` - 个人网站
- `googleScholar` - Google Scholar链接
- `github` - GitHub链接
- `orcid` - ORCID标识符

## 第二步：为成员添加个人主页数据

### 方式1: 直接使用SQL更新

```sql
-- 示例：为张俊文教授添加个人主页数据
UPDATE members SET
  education = '[
    {
      "institution": "复旦大学",
      "degree": "博士",
      "major": "光学工程",
      "period": "2010-2015"
    },
    {
      "institution": "复旦大学",
      "degree": "学士",
      "major": "电子信息工程",
      "period": "2006-2010"
    }
  ]',
  workExperience = '[
    {
      "organization": "复旦大学未来信息创新学院",
      "position": "教授",
      "period": "2020-至今",
      "description": "负责实验室的整体规划和研究方向，指导博士生和硕士生的科研工作。"
    }
  ]',
  projects = '[
    {
      "name": "面向6G的光纤-无线融合关键技术研究",
      "role": "项目负责人",
      "period": "2022-2025",
      "description": "研究面向6G通信的光纤-无线融合关键技术。"
    }
  ]',
  researchAreas = '[
    {
      "name": "光通信系统",
      "description": "研究高速光通信系统的设计、优化和实现。"
    }
  ]',
  personalWebsite = 'https://example.com/zhangjunwen',
  googleScholar = 'https://scholar.google.com/citations?user=XXXXX',
  github = 'https://github.com/zhangjunwen',
  orcid = '0000-0000-0000-0000'
WHERE nameCn = '张俊文';
```

### 方式2: 创建数据导入脚本

参考 `scripts/seed-member-example.mjs` 创建批量导入脚本。

## 第三步：启动开发服务器

```bash
# 安装依赖（如果还没有安装）
pnpm install

# 启动开发服务器
pnpm dev
```

## 第四步：访问个人主页

1. 打开浏览器访问 `http://localhost:5173`
2. 进入"团队成员"页面 (`/team`)
3. 点击任意成员卡片
4. 查看成员的个人主页

或者直接访问：`http://localhost:5173/member/1`（其中1是成员的ID）

## 数据格式说明

### 教育经历 (education)
```json
[
  {
    "institution": "学校名称",
    "degree": "学位（博士/硕士/学士）",
    "major": "专业名称",
    "period": "时间段（如：2010-2015）"
  }
]
```

### 工作经历 (workExperience)
```json
[
  {
    "organization": "单位名称",
    "position": "职位",
    "period": "时间段（如：2020-至今）",
    "description": "工作描述（可选）"
  }
]
```

### 项目经历 (projects)
```json
[
  {
    "name": "项目名称",
    "role": "项目角色",
    "period": "时间段",
    "description": "项目描述（可选）"
  }
]
```

### 研究方向 (researchAreas)
```json
[
  {
    "name": "研究方向名称",
    "description": "详细描述（可选）"
  }
]
```

## 注意事项

1. **JSON格式**：所有数组字段（education、workExperience等）都必须是有效的JSON字符串
2. **字段可选**：如果某个成员没有某些信息，可以不填写对应字段（设为NULL或空字符串）
3. **论文自动关联**：个人主页会自动显示该成员的论文，基于 `publications` 表中的 `authors` 或 `labMembers` 字段匹配
4. **已有字段**：`researchInterests`、`bio`、`awards` 等字段在原有系统中已存在，可以继续使用

## 常见问题

### Q: 如何测试没有数据库的情况？
A: 可以先不运行数据库，页面会显示"成员未找到"的友好提示。

### Q: 如何批量更新多个成员的数据？
A: 建议创建一个数据导入脚本，参考 `scripts/seed-member-example.mjs` 的格式。

### Q: 个人主页的URL是什么格式？
A: `/member/:id`，其中 `:id` 是成员在数据库中的ID（整数）。

### Q: 如何自定义个人主页的样式？
A: 编辑 `client/src/pages/MemberProfile.tsx` 文件，使用 TailwindCSS 类名调整样式。

## 下一步

- 为每个成员填充完整的个人信息
- 考虑添加管理后台方便更新数据
- 优化论文匹配算法
- 添加更多个性化模块

---

如有问题，请查看 `MEMBER_PROFILE_FEATURE.md` 获取更详细的技术文档。
