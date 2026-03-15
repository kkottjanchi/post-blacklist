// ========================================
// 블랙리스트 이후 설문 — Google Apps Script
// ========================================
// 이 코드를 Google Sheets > 확장 프로그램 > Apps Script에 붙여넣으세요.
//
// 설정 방법 (3단계):
// 1. Google Sheets 새로 만들기 (sheets.new)
//    → 시트 이름을 "블랙이후 설문"으로 변경
// 2. 확장 프로그램 > Apps Script 클릭
//    → 기존 코드 전부 지우고 이 파일 내용 전체 붙여넣기
//    → 저장 (Ctrl+S)
// 3. 배포 > 새 배포 > 유형: 웹 앱
//    → 실행 주체: 나
//    → 액세스 권한: 모든 사용자
//    → 배포 클릭 → URL 복사
//
// 복사한 URL을 나(Claude)에게 주면 설문에 연결합니다.
// ========================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // 헤더가 없으면 만들기
    if (sheet.getLastRow() === 0) {
      var headers = [
        '제출시간', '이름',
        '컨셉선택', '컨셉기타', '꼭있어야할것', '하지말것',
        '후원목표기준', '현실적목표', '후원자연결수',
        '역할', '역할기타',
        '홈페이지확인', '오픈여부', '수정의견'
      ];
      sheet.appendRow(headers);

      // 헤더 스타일
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#C8962A');
      headerRange.setFontColor('#FFFFFF');
      sheet.setFrozenRows(1);
    }

    // 데이터 행 추가
    var concept = Array.isArray(data.concept) ? data.concept.join(', ') : (data.concept || '');
    var role = Array.isArray(data.role) ? data.role.join(', ') : (data.role || '');

    var row = [
      new Date().toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'}),
      data.name || '',
      concept,
      data.concept_other || '',
      data.must_have || '',
      data.must_not || '',
      data.goal_type || '',
      data.goal_realistic || '',
      data.recruit_num || '0',
      role,
      data.role_etc || '',
      data.saw_site || '',
      data.site_launch || '',
      data.site_opinion || ''
    ];

    sheet.appendRow(row);

    // 열 너비 자동 조정 (처음 몇 행일 때만)
    if (sheet.getLastRow() <= 3) {
      for (var i = 1; i <= row.length; i++) {
        sheet.autoResizeColumn(i);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({result: 'ok', row: sheet.getLastRow()}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({result: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({status: 'alive', message: '블랙이후 설문 API 작동 중'}))
    .setMimeType(ContentService.MimeType.JSON);
}
