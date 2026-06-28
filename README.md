本项目主要用于实现xxx的开发。
工程文件提交到master分支上了
单词背诵小助手工程项目说明
一、项目概述
单词背诵小助手是一款轻量化、交互友好的移动端单词记忆工具，支持英译汉、汉译英两种背诵模式，搭配错词本收纳薄弱单词，可针对性强化复习，适配日常碎片化英语背诵场景，界面简洁清爽、操作门槛低，适合中小学生及英语入门学习者使用。
二、完成核心功能
1. 双背诵模式切换
英译汉模式：展示英文单词（如orange、apple、banana），用户可点击「查看答案」显示中文释义，完成词义回忆自测；可将掌握不牢的单词「标记错词」，归入错词本单独强化。
汉译英模式：展示中文词义（如 “葡萄”），用户可查看对应英文单词完成反向默写练习；已标记的错词会将按钮切换为「取消错词」，方便掌握后移出错词列表。
2. 错词本专项复习体系
支持对薄弱单词做标记收纳，进入错词专属复习列表；当单词从错词本调出后，操作按钮从红色「标记错词」变为橙色「取消错词」，灵活调整复习范围，实现针对性查漏补缺。
3. 单词轮播与搜索检索
点击「下一个单词」可切换词库内的下一个词条，实现连贯背诵流程；
顶部搜索栏支持输入英文或中文关键词快速检索目标单词，方便定向查找、复习特定词汇。
4. 状态动态 UI 适配
单词普通背诵页、错词复习页会自动切换按钮样式：常规状态为红色「标记错词」，错词状态为橙色「取消错词」；模式栏也会随场景切换「英译汉 / 错词本 / 全部」标签，界面状态和操作逻辑高度联动。
5. 程序已本地输入四级英语词汇库。
6. 已实现“一次开发，多端部署”功能。
三、技术架构
English（项目根工程）
├─ 构建编译层（hvigor/、.hvigor、oh_modules）
├─ 全局配置层（AppScope、根目录配置文件）
├─ 公共能力层（common_har 共享HAR模块）
└─ 设备应用层（entry手机端、entry_tablet平板端）
四、关键代码说明（以 HarmonyOS ArkTS 为例，可适配多端）
1. 词汇数据实体定义
typescript
运行
interface WordItem {
  en: string;    // 英文单词
  cn: string;    // 中文释义
  isError: boolean; // 是否为错词标记
}
2. 答案显隐控制逻辑
typescript
运行
@State showAnswer: boolean = false;
// 点击查看答案触发
onClickShowAnswer() {
  this.showAnswer = true;
}
3. 错词状态切换逻辑
typescript
运行
onClickMarkError() {
  this.currentWord.isError = !this.currentWord.isError;
}
4. 词条切换逻辑
typescript
运行
onClickNextWord() {
  // 根据当前模式（全部/错词本）筛选词池，取下一条数据
  this.getFilterWordList();
  this.showAnswer = false; // 切换新单词默认隐藏答案
}
5. 搜索过滤逻辑
typescript
运行
onSearch(text: string) {
  this.wordList = this.originList.filter(item=>
    item.en.includes(text) || item.cn.includes(text)
  )
}
五、项目亮点总结
双向背诵模式覆盖 “英译汉认词 + 汉译英默写” 两种记忆场景，背诵效率更高；
错词闭环管理，支持灵活增减复习条目，贴合艾宾浩斯记忆规律做针对性巩固；
界面轻量化、交互逻辑简单直观，移动端触控体验友好，同时可适配平板等不同尺寸设备；
检索功能支持快速定位词汇，兼顾随机背诵和定向复习两种使用需求。
六、演示图片
<img width="342" height="235" alt="屏幕截图 2026-06-28 160615" src="https://github.com/user-attachments/assets/a81aab1c-4f44-4e22-a95e-9c54e0dc168f" />
<img width="217" height="356" alt="屏幕截图 2026-06-28 160537" src="https://github.com/user-attachments/assets/11ed93e3-5c10-42ec-9b65-632c2b78d035" />
<img width="209" height="351" alt="屏幕截图 2026-06-28 160512" src="https://github.com/user-attachments/assets/35ed7208-9fea-4400-94e5-142194e1033e" />
<img width="196" height="343" alt="屏幕截图 2026-06-28 160415" src="https://github.com/user-attachments/assets/87509663-3c58-40b5-89e1-3d179d24eb25" />
<img width="186" height="340" alt="屏幕截图 2026-06-28 160435" src="https://github.com/user-attachments/assets/2a419f2e-c1f5-4230-bf64-8781c12250b7" />

七、拓展优化方向
后续可新增背诵进度统计、每日背诵打卡、单词发音朗读、自定义导入词表等功能，进一步拓展使用场景。
