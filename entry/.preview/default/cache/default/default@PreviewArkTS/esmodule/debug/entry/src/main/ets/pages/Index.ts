if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WordRecitePage_Params {
    wordList?: Word[];
    filteredWordList?: Word[];
    currentIndex?: number;
    showAnswer?: boolean;
    currentMode?: ReciteMode;
    searchText?: string;
    isWrongBook?: boolean;
}
import { Word } from "@normalized:N&&&entry/src/main/ets/common/Word&";
import { wordDictionary } from "@normalized:N&&&entry/src/main/ets/common/word-dictionary&";
import { saveWordList, getWordList } from "@normalized:N&&&entry/src/main/ets/common/Sputils&";
// 背诵模式枚举
enum ReciteMode {
    EN_TO_CN = // 英译汉
     0,
    CN_TO_EN = 1 // 汉译英
}
class WordRecitePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__wordList = new ObservedPropertyObjectPU([], this, "wordList");
        this.__filteredWordList = new ObservedPropertyObjectPU([] // 搜索/错词过滤后的列表
        , this, "filteredWordList");
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.__showAnswer = new ObservedPropertySimplePU(false, this, "showAnswer");
        this.__currentMode = new ObservedPropertySimplePU(ReciteMode.EN_TO_CN
        // 新增功能状态
        , this, "currentMode");
        this.__searchText = new ObservedPropertySimplePU("", this, "searchText");
        this.__isWrongBook = new ObservedPropertySimplePU(false // 是否开启错词本模式
        // 页面初始化
        , this, "isWrongBook");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WordRecitePage_Params) {
        if (params.wordList !== undefined) {
            this.wordList = params.wordList;
        }
        if (params.filteredWordList !== undefined) {
            this.filteredWordList = params.filteredWordList;
        }
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.showAnswer !== undefined) {
            this.showAnswer = params.showAnswer;
        }
        if (params.currentMode !== undefined) {
            this.currentMode = params.currentMode;
        }
        if (params.searchText !== undefined) {
            this.searchText = params.searchText;
        }
        if (params.isWrongBook !== undefined) {
            this.isWrongBook = params.isWrongBook;
        }
    }
    updateStateVars(params: WordRecitePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__wordList.purgeDependencyOnElmtId(rmElmtId);
        this.__filteredWordList.purgeDependencyOnElmtId(rmElmtId);
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__showAnswer.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMode.purgeDependencyOnElmtId(rmElmtId);
        this.__searchText.purgeDependencyOnElmtId(rmElmtId);
        this.__isWrongBook.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__wordList.aboutToBeDeleted();
        this.__filteredWordList.aboutToBeDeleted();
        this.__currentIndex.aboutToBeDeleted();
        this.__showAnswer.aboutToBeDeleted();
        this.__currentMode.aboutToBeDeleted();
        this.__searchText.aboutToBeDeleted();
        this.__isWrongBook.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 基础状态
    private __wordList: ObservedPropertyObjectPU<Word[]>;
    get wordList() {
        return this.__wordList.get();
    }
    set wordList(newValue: Word[]) {
        this.__wordList.set(newValue);
    }
    private __filteredWordList: ObservedPropertyObjectPU<Word[]>; // 搜索/错词过滤后的列表
    get filteredWordList() {
        return this.__filteredWordList.get();
    }
    set filteredWordList(newValue: Word[]) {
        this.__filteredWordList.set(newValue);
    }
    private __currentIndex: ObservedPropertySimplePU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __showAnswer: ObservedPropertySimplePU<boolean>;
    get showAnswer() {
        return this.__showAnswer.get();
    }
    set showAnswer(newValue: boolean) {
        this.__showAnswer.set(newValue);
    }
    private __currentMode: ObservedPropertySimplePU<ReciteMode>;
    get currentMode() {
        return this.__currentMode.get();
    }
    set currentMode(newValue: ReciteMode) {
        this.__currentMode.set(newValue);
    }
    // 新增功能状态
    private __searchText: ObservedPropertySimplePU<string>;
    get searchText() {
        return this.__searchText.get();
    }
    set searchText(newValue: string) {
        this.__searchText.set(newValue);
    }
    private __isWrongBook: ObservedPropertySimplePU<boolean>; // 是否开启错词本模式
    get isWrongBook() {
        return this.__isWrongBook.get();
    }
    set isWrongBook(newValue: boolean) {
        this.__isWrongBook.set(newValue);
    }
    // 页面初始化
    async aboutToAppear() {
        const localWords = await getWordList();
        if (localWords.length === 0) {
            // 首次启动：从单词库导入数据
            this.wordList = wordDictionary.map(item => new Word(item.english, item.chinese, item.isWrong || false));
            await saveWordList(this.wordList);
        }
        else {
            this.wordList = localWords;
        }
        this.filteredWordList = [...this.wordList]; // 初始化过滤列表
    }
    // 切换下一个单词
    nextWord() {
        if (this.filteredWordList.length === 0)
            return;
        this.currentIndex = (this.currentIndex + 1) % this.filteredWordList.length;
        this.showAnswer = false;
    }
    // 切换背诵模式
    switchMode() {
        this.currentMode = this.currentMode === ReciteMode.EN_TO_CN
            ? ReciteMode.CN_TO_EN
            : ReciteMode.EN_TO_CN;
        this.showAnswer = false;
    }
    // 搜索单词：实时过滤
    onSearchChange(value: string) {
        this.searchText = value.trim();
        if (this.searchText === "") {
            // 搜索框为空：显示全部/错词列表
            this.filteredWordList = this.isWrongBook
                ? [...this.wordList.filter(word => word.isWrong)]
                : [...this.wordList];
            return;
        }
        // 关键词匹配：英文或中文包含输入内容
        this.filteredWordList = this.wordList.filter(word => {
            const matchEng = word.english.toLowerCase().includes(this.searchText.toLowerCase());
            const matchChn = word.chinese.includes(this.searchText);
            // 错词本模式下只匹配错词
            return this.isWrongBook
                ? (word.isWrong && (matchEng || matchChn))
                : (matchEng || matchChn);
        });
        this.currentIndex = 0;
        this.showAnswer = false;
    }
    // 标记/取消错词
    toggleWrongWord() {
        if (this.filteredWordList.length === 0)
            return;
        const currentWord = this.filteredWordList[this.currentIndex];
        currentWord.isWrong = !currentWord.isWrong;
        // 更新原列表并保存
        const originIndex = this.wordList.findIndex(word => word.english === currentWord.english);
        if (originIndex !== -1) {
            this.wordList[originIndex] = currentWord;
        }
        saveWordList(this.wordList);
        this.onSearchChange(this.searchText); // 刷新过滤列表
    }
    // 切换错词本/全部单词模式
    toggleWrongBook() {
        this.isWrongBook = !this.isWrongBook;
        this.searchText = "";
        this.onSearchChange("");
        this.currentIndex = 0;
        this.showAnswer = false;
    }
    // 构建UI界面
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/Index.ets(102:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F7FA');
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部栏：标题+模式切换+错词本切换
            Row.create({ space: 10 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(104:7)", "entry");
            // 顶部栏：标题+模式切换+错词本切换
            Row.width('90%');
            // 顶部栏：标题+模式切换+错词本切换
            Row.margin({ top: 30, bottom: 15 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create("单词背诵小助手");
            Text.debugLine("entry/src/main/ets/pages/Index.ets(105:9)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#3366CC');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/Index.ets(109:9)", "entry");
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.currentMode === ReciteMode.EN_TO_CN ? "英译汉" : "汉译英");
            Button.debugLine("entry/src/main/ets/pages/Index.ets(110:9)", "entry");
            Button.fontSize(12);
            Button.backgroundColor('#4CAF50');
            Button.fontColor(Color.White);
            Button.borderRadius(20);
            Button.width(70);
            Button.onClick(() => this.switchMode());
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.isWrongBook ? "全部单词" : "错词本");
            Button.debugLine("entry/src/main/ets/pages/Index.ets(117:9)", "entry");
            Button.fontSize(12);
            Button.backgroundColor(this.isWrongBook ? '#FF5722' : '#607D8B');
            Button.fontColor(Color.White);
            Button.borderRadius(20);
            Button.width(70);
            Button.onClick(() => this.toggleWrongBook());
        }, Button);
        Button.pop();
        // 顶部栏：标题+模式切换+错词本切换
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索框
            Search.create({ placeholder: "输入英文/中文搜索", value: this.searchText });
            Search.debugLine("entry/src/main/ets/pages/Index.ets(129:7)", "entry");
            // 搜索框
            Search.width('90%');
            // 搜索框
            Search.height(40);
            // 搜索框
            Search.backgroundColor(Color.White);
            // 搜索框
            Search.borderRadius(8);
            // 搜索框
            Search.onChange((value) => this.onSearchChange(value));
            // 搜索框
            Search.margin({ bottom: 15 });
        }, Search);
        // 搜索框
        Search.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 单词卡片展示区
            if (this.filteredWordList.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.debugLine("entry/src/main/ets/pages/Index.ets(139:9)", "entry");
                        Stack.width('90%');
                        Stack.backgroundColor(Color.White);
                        Stack.borderRadius(16);
                        Stack.shadow({ radius: 12, color: '#CCCCCC', offsetX: 0, offsetY: 4 });
                        Stack.margin({ bottom: 30 });
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/Index.ets(140:11)", "entry");
                        Column.width('100%');
                        Column.padding(40);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.currentMode === ReciteMode.EN_TO_CN
                            ? this.filteredWordList[this.currentIndex].english
                            : this.filteredWordList[this.currentIndex].chinese);
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(141:13)", "entry");
                        Text.fontSize(36);
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ bottom: 20 });
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.showAnswer) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(this.currentMode === ReciteMode.EN_TO_CN
                                        ? this.filteredWordList[this.currentIndex].chinese
                                        : this.filteredWordList[this.currentIndex].english);
                                    Text.debugLine("entry/src/main/ets/pages/Index.ets(150:15)", "entry");
                                    Text.fontSize(22);
                                    Text.fontColor(Color.Grey);
                                    Text.textAlign(TextAlign.Center);
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                    Stack.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 无数据提示
                        Text.create(this.isWrongBook ? "暂无标记错词" : "无匹配单词");
                        Text.debugLine("entry/src/main/ets/pages/Index.ets(168:9)", "entry");
                        // 无数据提示
                        Text.fontSize(20);
                        // 无数据提示
                        Text.fontColor(Color.Grey);
                        // 无数据提示
                        Text.margin({ bottom: 30 });
                    }, Text);
                    // 无数据提示
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 功能按钮区
            Row.create({ space: 20 });
            Row.debugLine("entry/src/main/ets/pages/Index.ets(175:7)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel("查看答案");
            Button.debugLine("entry/src/main/ets/pages/Index.ets(176:9)", "entry");
            Button.width(110);
            Button.height(45);
            Button.backgroundColor('#2196F3');
            Button.fontColor(Color.White);
            Button.borderRadius(8);
            Button.onClick(() => this.showAnswer = true);
            Button.enabled(this.filteredWordList.length > 0);
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.filteredWordList.length > 0 && this.filteredWordList[this.currentIndex].isWrong
                ? "取消错词" : "标记错词");
            Button.debugLine("entry/src/main/ets/pages/Index.ets(185:9)", "entry");
            Button.width(110);
            Button.height(45);
            Button.backgroundColor(this.filteredWordList.length > 0 && this.filteredWordList[this.currentIndex].isWrong
                ? '#FF9800' : '#F44336');
            Button.fontColor(Color.White);
            Button.borderRadius(8);
            Button.onClick(() => this.toggleWrongWord());
            Button.enabled(this.filteredWordList.length > 0);
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel("下一个单词");
            Button.debugLine("entry/src/main/ets/pages/Index.ets(196:9)", "entry");
            Button.width(110);
            Button.height(45);
            Button.backgroundColor('#4CAF50');
            Button.fontColor(Color.White);
            Button.borderRadius(8);
            Button.onClick(() => this.nextWord());
            Button.enabled(this.filteredWordList.length > 0);
        }, Button);
        Button.pop();
        // 功能按钮区
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "WordRecitePage";
    }
}
registerNamedRoute(() => new WordRecitePage(undefined, {}), "", { bundleName: "com.example.english", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
