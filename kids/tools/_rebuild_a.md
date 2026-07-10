# 任務：獨立重建英文詞庫（250~350 條）
讀 kids/tools/_mail_words.txt（223 封信英文高頻字）與 kids/tools/_repair_terms.txt（10 萬筆維修紀錄英文詞頻，UNIGRAM+BIGRAM）。
使用者：半導體測試設備維修公司窗口。用你自己的判斷挑有教學價值的字（不要讀 adult/ 目錄，這是刻意獨立重建）。
略過：人名、公司名、信尾免責模板、內部代號。
每條：{"en":"…","zh":"…","kind":"business"|"repair","level":1|2|3}，level 抓 60/30/10。
寫檔 kids/tools/_rebuild_en.json：{"en_terms":[…]}。回覆只要統計。直接產完整內容，不要佔位符，不要先探索其他檔案。
