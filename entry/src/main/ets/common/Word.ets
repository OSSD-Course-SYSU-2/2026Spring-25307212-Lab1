export class Word {
  english: string = ""
  chinese: string = ""
  isWrong: boolean = false // 错词标记属性

  constructor(english: string, chinese: string, isWrong: boolean = false) {
    this.english = english
    this.chinese = chinese
    this.isWrong = isWrong
  }
}