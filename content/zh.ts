import { contact, education, experience, highlight, MORE_PROJECTS, organizations, projects, skills, SOCIAL, toArtifacts } from "./shared";
import type { Site } from "./types";

const exps = experience([
  {
    role: "技术与客户成功经理",
    company: "TREEO",
    period: "2026年5月 – 至今",
    body: [
      highlight(
        "端到端管理 TREEO 的客户成功，包括通过实地考察了解合作伙伴需求、借助数据分析工具分析现场与平台数据，支持数据驱动的决策、优化应用 UI/UX，以及为合作伙伴编写相关培训与文档。",
        "端到端管理 TREEO 的客户成功",
      ),
    ],
  },
  {
    role: "运营与客户成功经理",
    company: "TREEO",
    period: "2024年5月 – 2026年5月",
    body: [
      highlight(
        "与五个种树合作伙伴（Tree Planting Partners）共同开展日常运营——种植项目的规划与监控、担任每位合作伙伴的主要联系人、维护数据质量与报告——同时在实地负责客户成功：评估 TREEO 用户体验、监控系统每日活动，并优化应用 UI/UX。",
        "五个种树合作伙伴",
      ),
    ],
  },
  {
    role: "客户成功工程师",
    company: "TREEO",
    period: "2023年5月 – 2024年5月",
    body: [
      "实地评估与考察 TREEO 的用户体验。",
      "监控云平台上的每日系统活动。",
      "参与应用 UI/UX 的改进与开发。",
      highlight("直接向用户提供技术支持与培训。", "技术支持与培训"),
    ],
  },
  {
    role: "移动端开发工程师",
    company: "自由职业顾问",
    period: "2022年10月 – 2023年4月",
    body: [
      highlight(
        "使用 Kotlin 和 Java 在 Android Studio 中设计并发布 Android 应用。为移动端与网页端制作线框图和高保真原型，并与利益相关者密切合作，将业务需求转化为直观的用户界面。",
        "设计并发布 Android 应用",
      ),
    ],
  },
  {
    role: "HPPS项目协调员助理",
    company: "Fairventures Worldwide",
    period: "2022年2月 – 2023年3月",
    body: [highlight("编制数据流程与安全材料，管理数据收集与处理流程，并确保新的安全规程在整个团队中得到一致落实。", "新的安全规程")],
  },
  {
    role: "综合事务专员",
    company: "Fairventures Worldwide",
    period: "2019年10月 – 2022年2月",
    body: [highlight("负责全部办公室运营，涵盖合同管理、资产交接、安保与司机团队协调、公务车辆维护，以及公司全部资产的盘点。", "全部办公室运营")],
  },
  {
    role: "产品演示专员",
    company: "Quick Tractor",
    period: "2019年7月 – 2019年9月",
    body: [highlight("全程负责 B2B 客户沟通，并在苏门答腊、苏拉威西和加里曼丹地区的油棕种植园演示 Quick Tractor 产品。", "Quick Tractor 产品")],
  },
  {
    role: "实习生",
    company: "Indonesia Central Bureau of Statistics",
    period: "2018年7月 – 2018年12月",
    body: [highlight("为年度人口普查出版物设计封面，并制作海报与矢量图形等视觉素材，以支持发布活动。", "为年度人口普查出版物设计封面")],
  },
]);

export const zh: Site = {
  lang: "zh",
  meta: {
    title: "Mardiansyah Gunting（吗尔迪按夏）— 打造让运营运转更顺畅的工具",
    description: "打造让运营运转更顺畅的工具，专注项目管理、数据自动化与运营——连接团队，清除重复性工作。",
  },
  name: "吗尔迪按夏",
  role: "打造让运营运转更顺畅的工具",
  status: { label: "可联系", note: "欢迎新的合作" },
  hero: [
    "我的工作落在运营、技术与战略的交汇处——连接团队，构建",
    { text: "他们真正需要的工具", href: "#projects" },
    "，并清除那些悄悄拖慢业务的重复性工作。目前我在 ",
    { text: "TREEO", href: "https://treeo.id/" },
    " 做这件事。",
  ],
  now: {
    lead: "目前我担任技术与客户成功经理，就职于",
    company: "TREEO",
    rest: "我实地走访合作伙伴，分析运营数据，让每个决策都以数据为依据，优化应用的 UI/UX，并为合作伙伴准备他们依赖的培训与文档。",
    about: [
      "我打造帮助人们减少不必要阻力的应用——根据每个项目的具体情境选用最合适的编程语言来实现数据请求自动化，帮助团队简化数据采集的工作流程，并将重复的手工流程变成可靠的工具。无论是在印度尼西亚各地协调植树项目，还是发布一款 Android 应用，目标始终一致：可衡量、有用、能长久延续。",
      "与初创公司、国际非政府组织和政府机构共事的经历，让我学会了快速适应并跨文化沟通，也让我更加确信：真正出色的成果，来自扎实的领域理解与恰当技术的结合。我目前对新职位与合作持开放态度，也很乐意与您交流。",
    ],
  },
  organizations: organizations({
    "treeo-indonesia": { name: "TREEO", note: "2026 – 至今" },
    "fairventures-digital": { name: "TREEO", note: "TREEO · 2023 – 2026" },
    "fairventures-worldwide": { name: "Fairventures Worldwide gGmbH", note: "2019 – 2023" },
    "karya-hidup-sentosa": { name: "CV Karya Hidup Sentosa", note: "Quick · 2019" },
    bps: { name: "Badan Pusat Statistik", note: "印尼中央统计局 · 2018" },
  }),
  productsLine: [
    "工作之余，我也开发了一些自己的项目，部分可以在 ",
    { text: "GitHub", href: MORE_PROJECTS },
    " 上查看。",
  ],
  projects: projects(
    {
      "workflow-automation": {
        title: "工作流自动化",
        kind: "内部项目 · Python",
        summary: "构建内部自动化流程，简化数据工作流（ETL：抽取、转换、加载）与格式更新。通过可靠、安全的数据处理，提升团队日常运营效率。",
        captions: ["原始数据输入，整洁报表输出——按计划完成抽取、转换与加载。", "自动化如何运作"],
      },
      "treeo-website": {
        title: "TREEO Indonesia 网站",
        kind: "网站",
        summary: "参与 TREEO Indonesia 网站的开发，优化动画并设计响应式移动端布局，以提升移动设备的性能与用户体验。",
        captions: ["更流畅、经过优化的动画。", "为手机打造的响应式布局。"],
      },
      "audio-transkript": {
        title: "Audio Transkript",
        kind: "Python 工具",
        summary:
          "一个小型 Python 工具，把录音转成 Word 文字稿：用 pydub 读取音频，长录音按 45 秒切段，每段交给云端语音识别（默认印尼语，可用 --language 切换其他语言），再用 python-docx 写入 .docx。",
        captions: ["输入音频，按 45 秒切段，语音识别，输出 Word 文档。", "在 Jupyter Notebook 中运行。"],
      },
      "cad-converter": {
        title: "CAD Converter",
        kind: "Python 工具",
        summary:
          "使用 GDAL 和 GeoPandas 构建 Python 工具，将 CAD 格式（DWG/DXF）转换为 GIS 格式（Esri Shapefile/GeoJSON），支持 API 集成，并准备空间数据结构以满足 GIS 分析需求。",
        captions: ["输入 DWG/DXF，输出 Esri Shapefile 或 GeoJSON。", "转换后的图层，可直接用于 GIS 制图与分析。"],
      },
    },
    { github: "在 GitHub 查看", website: "访问网站" },
  ),
  moreProjectsHref: MORE_PROJECTS,
  skills: skills(
    ["软件工程", "客户成功与客户关系", "运营与项目管理", "外勤、调研与数据", "物流与行政总务"],
    { title: "语言", items: ["英语（专业工作水平）", "印尼语（母语）", "中文（初级）"] },
    {
      title: "各技能在岗位中的使用频率",
      labels: {
        communication: "沟通与利益相关方关系",
        fieldops: "实地考察与现场运营",
        datamonitoring: "数据监测、质量与报告",
        training: "培训与用户文档",
        uiux: "UI/UX 与产品设计",
        opsmgmt: "运营与流程管理",
      },
      of: (n, total) => `${total} 段经历中有 ${n} 段`,
    },
  ),
  experience: exps,
  education: education([
    { school: "Universitas Terbuka", programme: "工商管理学士（BBA），商业/管理经济学", period: "2024年 – 至今" },
    { school: "Binar Academy", programme: "数据科学训练营", period: "2023年6月 – 2023年11月" },
    { school: "Binar Academy", programme: "移动开发训练营", period: "2022年12月 – 2023年5月" },
    { school: "SMKN 1 Sampit", programme: "信息技术工程", period: "2017年7月 – 2019年8月" },
  ]),
  artifacts: toArtifacts(exps),
  contact: contact("zh"),
  social: SOCIAL,
  ui: {
    sections: {
      now: "现在",
      projects: "项目",
      skills: "技能",
      experience: "经历",
      education: "教育",
      gallery: "现场记录",
    },
    readMore: "阅读更多",
    visitSite: "访问网站",
    opensNewTab: "在新标签页中打开",
    galleryHint: "滚动深入 · 点击细看",
    close: "关闭",
    previous: "上一张",
    next: "下一张",
    copied: "已复制到剪贴板",
    downloadCv: "下载简历",
    sendMessage: "发送消息",
    emailLabel: "邮箱",
    rights: "版权所有。",
    language: "语言",
    moreProjects: "想了解更多？在 GitHub 查看我的全部项目",
    form: {
      title: "发送消息",
      name: "姓名",
      email: "邮箱",
      message: "留言",
      send: "发送",
      incomplete: "请填写所有字段。",
      sending: "发送中…",
      sent: "消息已发送 — 谢谢！",
      error: "发送失败。请重试或直接给我发邮件。",
    },
  },
};
