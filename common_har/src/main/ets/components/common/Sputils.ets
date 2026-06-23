import preferences from '@ohos.data.preferences'
import { BusinessError } from '@ohos.base'
import { Word } from './Word'

const PREF_NAME = "WordRecitePref"
const WORD_KEY = "wordList"

// 获取 Preferences 实例
async function getPref(): Promise<preferences.Preferences> {
  try {
    return await preferences.getPreferences(getContext(), PREF_NAME)
  } catch (err) {
    console.error("获取Preferences失败: " + JSON.stringify(err))
    throw new Error("获取Preferences失败: " + JSON.stringify(err))
  }
}

// 保存单词列表到本地
export async function saveWordList(list: Word[]): Promise<void> {
  try {
    const pref = await getPref()
    await pref.put(WORD_KEY, JSON.stringify(list))
    await pref.flush()
  } catch (err) {
    console.error("保存单词列表失败: " + JSON.stringify(err))
  }
}

// 从本地读取单词列表
export async function getWordList(): Promise<Word[]> {
  try {
    const pref = await getPref()
    const str = await pref.get(WORD_KEY, "[]") as string
    return JSON.parse(str)
  } catch (err) {
    console.error("读取单词列表失败: " + JSON.stringify(err))
    return []
  }
}