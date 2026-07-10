# 任務：維修狀態簡報句庫（60 句＋30 個迷你講稿）

為半導體維修公司窗口（A2→B1-）建「30-60 秒口頭狀態更新」素材。
框架五功能：opening 開場 / status 現況 / finding 發現 / next 下一步 / closing 結尾。

## 輸出 1：sentences（60 句，每功能 12 句）
{"id":"bf_op_01","fn":"opening","en":"I'd like to give a quick update on this repair.","zh":"我簡單更新一下這台的維修狀況"}
- id 規則：bf_{op|st|fd|nx|cl}_01~12
- 句長 6~14 字、口語可唸、A2-B1
- 涵蓋情境：一般更新/報價說明/延遲說明/驗證結果/來訪簡報/電話更新
- status 句要含常用狀態：under repair / pending verification / waiting for parts / testing / completed
- finding 句要含常見發現：damaged component / abnormal voltage / intermittent failure / no problem found

## 輸出 2：scripts（30 個迷你講稿）
{"id":"sc_01","title":"標準進度更新","zh":"跟客戶電話更新維修進度","lines":["bf_op_01","bf_st_03","bf_fd_02","bf_nx_01","bf_cl_04"]}
- 每個講稿恰 5 行，依 opening→status→finding→next→closing 各取 1 句 id（要語意連貫！）
- 30 個涵蓋：進度更新×8、報價說明×5、延遲通知×5、驗證完成×4、來訪開場×4、電話收尾×4
- title 中文

寫檔 kids/tools/_p3_brief.json：{"sentences":[…60…],"scripts":[…30…]}
回覆只要統計。直接產完整內容，不要佔位符，不要探索檔案。
