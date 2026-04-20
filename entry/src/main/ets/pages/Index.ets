
import { Word } from '../common/Word'
import { wordDictionary } from '../common/word-dictionary'
import { saveWordList, getWordList } from '../common/Sputils'

// 背诵模式枚举
enum ReciteMode {
  EN_TO_CN, // 英译汉
  CN_TO_EN  // 汉译英
}

@Entry
@Component
struct WordRecitePage {
  // 基础状态
  @State wordList: Word[] = []
  @State filteredWordList: Word[] = [] // 搜索/错词过滤后的列表
  @State currentIndex: number = 0
  @State showAnswer: boolean = false
  @State currentMode: ReciteMode = ReciteMode.EN_TO_CN

  // 新增功能状态
  @State searchText: string = ""
  @State isWrongBook: boolean = false // 是否开启错词本模式

  // 页面初始化
  async aboutToAppear() {
    const localWords = await getWordList()
    if (localWords.length === 0) {
      // 首次启动：从单词库导入数据
      this.wordList = wordDictionary.map(item => new Word(item.english, item.chinese, item.isWrong || false))
      await saveWordList(this.wordList)
    } else {
      this.wordList = localWords
    }
    this.filteredWordList = [...this.wordList] // 初始化过滤列表
  }

  // 切换下一个单词
  nextWord() {
    if (this.filteredWordList.length === 0) return
    this.currentIndex = (this.currentIndex + 1) % this.filteredWordList.length
    this.showAnswer = false
  }

  // 切换背诵模式
  switchMode() {
    this.currentMode = this.currentMode === ReciteMode.EN_TO_CN
      ? ReciteMode.CN_TO_EN
      : ReciteMode.EN_TO_CN
    this.showAnswer = false
  }

  // 搜索单词：实时过滤
  onSearchChange(value: string) {
    this.searchText = value.trim()
    if (this.searchText === "") {
      // 搜索框为空：显示全部/错词列表
      this.filteredWordList = this.isWrongBook
        ? [...this.wordList.filter(word => word.isWrong)]
        : [...this.wordList]
      return
    }
    // 关键词匹配：英文或中文包含输入内容
    this.filteredWordList = this.wordList.filter(word => {
      const matchEng = word.english.toLowerCase().includes(this.searchText.toLowerCase())
      const matchChn = word.chinese.includes(this.searchText)
      // 错词本模式下只匹配错词
      return this.isWrongBook
        ? (word.isWrong && (matchEng || matchChn))
        : (matchEng || matchChn)
    })
    this.currentIndex = 0
    this.showAnswer = false
  }

  // 标记/取消错词
  toggleWrongWord() {
    if (this.filteredWordList.length === 0) return
    const currentWord = this.filteredWordList[this.currentIndex]
    currentWord.isWrong = !currentWord.isWrong
    // 更新原列表并保存
    const originIndex = this.wordList.findIndex(word => word.english === currentWord.english)
    if (originIndex !== -1) {
      this.wordList[originIndex] = currentWord
    }
    saveWordList(this.wordList)
    this.onSearchChange(this.searchText) // 刷新过滤列表
  }

  // 切换错词本/全部单词模式
  toggleWrongBook() {
    this.isWrongBook = !this.isWrongBook
    this.searchText = ""
    this.onSearchChange("")
    this.currentIndex = 0
    this.showAnswer = false
  }

  // 构建UI界面
  build() {
    Column() {
      // 顶部栏：标题+模式切换+错词本切换
      Row({ space: 10 }) {
        Text("单词背诵小助手")
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
          .fontColor('#3366CC')
        Blank()
        Button(this.currentMode === ReciteMode.EN_TO_CN ? "英译汉" : "汉译英")
          .fontSize(12)
          .backgroundColor('#4CAF50')
          .fontColor(Color.White)
          .borderRadius(20)
          .width(70)
          .onClick(() => this.switchMode())
        Button(this.isWrongBook ? "全部单词" : "错词本")
          .fontSize(12)
          .backgroundColor(this.isWrongBook ? '#FF5722' : '#607D8B')
          .fontColor(Color.White)
          .borderRadius(20)
          .width(70)
          .onClick(() => this.toggleWrongBook())
      }
      .width('90%')
      .margin({ top: 30, bottom: 15 })

      // 搜索框
      Search({ placeholder: "输入英文/中文搜索", value: this.searchText })
        .width('90%')
        .height(40)
        .backgroundColor(Color.White)
        .borderRadius(8)
        .onChange((value) => this.onSearchChange(value))
        .margin({ bottom: 15 })

      // 单词卡片展示区
      if (this.filteredWordList.length > 0) {
        Stack() {
          Column() {
            Text(this.currentMode === ReciteMode.EN_TO_CN
              ? this.filteredWordList[this.currentIndex].english
              : this.filteredWordList[this.currentIndex].chinese)
              .fontSize(36)
              .fontWeight(FontWeight.Bold)
              .margin({ bottom: 20 })
              .textAlign(TextAlign.Center)

            if (this.showAnswer) {
              Text(this.currentMode === ReciteMode.EN_TO_CN
                ? this.filteredWordList[this.currentIndex].chinese
                : this.filteredWordList[this.currentIndex].english)
                .fontSize(22)
                .fontColor(Color.Grey)
                .textAlign(TextAlign.Center)
            }
          }
          .width('100%')
          .padding(40)
        }
        .width('90%')
        .backgroundColor(Color.White)
        .borderRadius(16)
        .shadow({ radius: 12, color: '#CCCCCC', offsetX: 0, offsetY: 4 })
        .margin({ bottom: 30 })
      } else {
        // 无数据提示
        Text(this.isWrongBook ? "暂无标记错词" : "无匹配单词")
          .fontSize(20)
          .fontColor(Color.Grey)
          .margin({ bottom: 30 })
      }

      // 功能按钮区
      Row({ space: 20 }) {
        Button("查看答案")
          .width(110)
          .height(45)
          .backgroundColor('#2196F3')
          .fontColor(Color.White)
          .borderRadius(8)
          .onClick(() => this.showAnswer = true)
          .enabled(this.filteredWordList.length > 0)

        Button(this.filteredWordList.length > 0 && this.filteredWordList[this.currentIndex].isWrong
          ? "取消错词" : "标记错词")
          .width(110)
          .height(45)
          .backgroundColor(this.filteredWordList.length > 0 && this.filteredWordList[this.currentIndex].isWrong
            ? '#FF9800' : '#F44336')
          .fontColor(Color.White)
          .borderRadius(8)
          .onClick(() => this.toggleWrongWord())
          .enabled(this.filteredWordList.length > 0)

        Button("下一个单词")
          .width(110)
          .height(45)
          .backgroundColor('#4CAF50')
          .fontColor(Color.White)
          .borderRadius(8)
          .onClick(() => this.nextWord())
          .enabled(this.filteredWordList.length > 0)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F7FA')
    .justifyContent(FlexAlign.Center)
  }
}