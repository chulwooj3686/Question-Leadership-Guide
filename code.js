// 이 코드를 Google Apps Script 에디터(script.google.com)의 Code.gs 파일에 붙여넣고 저장하세요.
// 기존에 배포된 URL을 계속 사용하려면 코드 수정 후 [배포] -> [배포 관리] -> [수정] 아이콘 클릭 -> [새 버전] 선택 -> [배포]를 해야 업데이트가 반영됩니다.

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheetName = "Leadership_DB";
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(sheetName);

    // 시트가 없으면 생성하고 헤더 추가
    if (!sheet) {
      sheet = doc.insertSheet(sheetName);
      sheet.appendRow([
        "Timestamp", 
        "User Company", 
        "User Position", 
        "Target Position", 
        "Situation Type",
        "Intimacy (1-5)",
        "Trust (1-5)",
        "Step 1 Question", 
        "Step 1 Purpose",
        "Step 2 Question", 
        "Step 2 Purpose",
        "Step 3 Question", 
        "Step 3 Purpose",
        "Step 4 Question", 
        "Step 4 Purpose"
      ]);
    }

    // POST 요청으로 들어온 JSON 데이터 파싱
    var data = JSON.parse(e.postData.contents);
    var formData = data.formData;
    var steps = data.steps;

    // 단계별 데이터 안전하게 추출
    var q1 = (steps && steps[0]) ? steps[0].question : "";
    var p1 = (steps && steps[0]) ? steps[0].purpose : "";
    var q2 = (steps && steps[1]) ? steps[1].question : "";
    var p2 = (steps && steps[1]) ? steps[1].purpose : "";
    var q3 = (steps && steps[2]) ? steps[2].question : "";
    var p3 = (steps && steps[2]) ? steps[2].purpose : "";
    var q4 = (steps && steps[3]) ? steps[3].question : "";
    var p4 = (steps && steps[3]) ? steps[3].purpose : "";

    var nextRow = [
      new Date(), // Timestamp
      formData.userCompany,
      formData.userPosition,
      formData.targetPosition,
      formData.situationType,
      formData.intimacy,
      formData.orgTrust,
      q1, p1,
      q2, p2,
      q3, p3,
      q4, p4
    ];

    sheet.appendRow(nextRow);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function setup() {
  // 권한 설정을 위해 에디터에서 이 함수를 한 번 실행해주세요.
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log("Current Spreadsheet URL: " + doc.getUrl());
}