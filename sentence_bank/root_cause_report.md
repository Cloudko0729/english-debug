# Root Cause Report Sentences

簡短說明 cause、action taken、prevention，適合 failure analysis / repair summary。

---

## 說明根本原因

- The root cause of the failure has been identified as [cause].
- After analysis, we determined that the failure was caused by [cause].
- The failure was traced back to [component / condition].
- The root cause was confirmed to be EEPROM data corruption due to an incomplete write operation.

## 說明已採取的動作

- We have reflashed the EEPROM with the correct golden file and verified the data integrity.
- The affected component has been replaced and the unit has passed all functional tests.
- We performed a full reset and reconfiguration of the firmware settings.
- The unit has been repaired and tested. All parameters are now within specification.

## 說明預防措施

- To prevent recurrence, we recommend [action].
- We have updated our test procedure to include an EEPROM checksum verification step.
- A firmware version check will be added to the incoming inspection process.
- We will monitor this issue in future units and report if the problem recurs.

## 結案 / 摘要格式

- Root Cause: [description]
- Action Taken: [description]
- Current Status: Repaired / Replaced / Under Investigation
- Recommendation: [description]
