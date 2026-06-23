export interface WordItem {
    english: string;
    chinese: string;
    isWrong?: boolean;
}
// 初始化单词库，可自行扩展
export const wordDictionary: WordItem[] = [
    { "english": "apple", "chinese": "苹果；苹果树" },
    { "english": "banana", "chinese": "香蕉；芭蕉" },
    { "english": "orange", "chinese": "橙子；橘子；橙色" },
    { "english": "grape", "chinese": "葡萄；葡萄藤" },
    { "english": "watermelon", "chinese": "西瓜" },
    { "english": "pear", "chinese": "梨" },
    { "english": "pineapple", "chinese": "菠萝" },
    { "english": "strawberry", "chinese": "草莓" }
];
