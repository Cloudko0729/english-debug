# 任務：世界城市卡 二階內容（9 城交流包＋12 人物卡）

格式範例已完整內嵌如下，不需要也不要讀任何檔案。

## 輸出 A：9 城交流包（seoul, paris, singapore, newyork, bangkok, rome, sydney, cairo, rio）
每城：
{"id":"seoul","clue":"英文線索(不直接講答案,8~14字)","clueZh":"線索中文","pref":"禮物id","cards":[文化卡,景點卡]}
- 偏好禮物對應（沿用/新增禮物池）：seoul=bookmark(韓紙書籤)、paris=baguette、singapore=orchid、bangkok=jasmine(新增 💮 茉莉花環)、rome=gelato、newyork=bagel、sydney=surfboard、cairo=papyrus(新增 📜 紙莎草)、rio=carnivalmask(新增 🎭 嘉年華面具)
- 卡片格式同一階：{"id":"seoul_culture","type":"culture","lv":2,"emoji":"…","en":"…","zh":"…","sent":"6~12字英文句","sentZh":"…","fact":"30~50字中文文化小知識","words":["3個重點單字"]}
- 文化卡選該城著名文化（韓服/塞納河畔/魚尾獅傳說/百老匯/水上市場/羅馬競技/衝浪文化/尼羅河/森巴嘉年華等你判斷）
- 景點卡選第二地標（景福宮/羅浮宮/濱海灣花園/中央公園/大皇宮/特雷維噴泉/邦代海灘/埃及博物館/糖麵包山等你判斷）

## 輸出 B：12 城人物卡（含一階 3 城）
{"id":"tokyo_person","type":"person","lv":4,"emoji":"🎨","en":"Hokusai","zh":"葛飾北齋","sent":"Hokusai painted the Great Wave.","sentZh":"…","fact":"…","words":[…],"era":"年代","field":"領域"}
- **只選已故、教育價值高、與城市關聯明確**的人物；避免在世/政治爭議人物
- 建議候選（可調整）：台北 鄧麗君、東京 葛飾北齋、倫敦 莎士比亞、首爾 世宗大王、巴黎 莫內、羅馬 達文西(或更貼羅馬者)、紐約 你選、新加坡 你選(避政治)、曼谷 你選(避王室)、雪梨 Steve Irwin、開羅 圖坦卡門、里約 比利
- 句子 6~12 字、小學生能懂

寫檔 kids/tools/_city_p2.json：{"exchange":{…9城…},"persons":[…12張…],"newGifts":[{"id":"jasmine","emoji":"💮","en":"jasmine garland","zh":"茉莉花環"},…]}
回覆只要統計。直接產完整內容寫檔，不要佔位符。
