# 팟캐스트 주제 검증 자동화 워크플로우 수정 사항

## 📊 워크플로우 개요

**이름**: 팟캐스트 주제 검증 자동화
**노드 수**: 31개
**주요 기능**: 노션 웹훅 → Perplexity AI → Claude AI → ChatGPT → 노션 업데이트 → 텔레그램 알림

---

## 🔍 발견된 오류 (4가지)

### 🔴 1. 노드 참조 불일치 (치명적)
**영향받는 노드**: 텔레그램 에러 알림 노드 4개
- 텔레그램 - 1단계 에러
- 텔레그램 - 2단계 에러
- 텔레그램 - 3단계 에러
- 텔레그램 - 5단계 에러

**문제**:
```javascript
// 잘못된 참조
$('변수 설정').item.json.topic
```

**원인**: 실제 노드 이름은 `변수 설정1`인데 `변수 설정`을 참조

**영향**: 모든 에러 알림이 실패하여 워크플로우 문제를 파악하기 어려움

**수정**:
```javascript
// 올바른 참조
$('변수 설정1').item.json.topic
```

**파일**: `01-telegram-error-nodes-fix.json`

---

### 🔴 2. 3단계 요청 준비 로직 손상 (치명적)
**영향받는 노드**: 3단계 요청 준비

**문제**:
- 디버깅 코드로 되어 있어 실제 Claude API 요청 본문을 생성하지 않음
- `3단계 - Claude (대본 구조)1` 노드가 `$json.claudeRequestBody`를 기대하지만 제공되지 않음

**원인**: 개발 중 디버깅 코드가 그대로 남아있음

**영향**: 3단계가 완전히 실패하여 워크플로우 중단

**수정**:
- 1단계와 2단계 결과를 사용하여 프롬프트 생성
- Claude API 요청 본문을 올바른 형식으로 생성
```javascript
const claudeRequestBody = {
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 4096,
  "messages": [...]
};
```

**파일**: `02-step3-request-preparation-fix.json`

---

### 🔴 3. 2단계 노션 저장 URL 오류 (치명적)
**영향받는 노드**: HTTP - 노션 2단계 저장1

**문제**:
```javascript
// 잘못된 URL
"url": "https://api.notion.com/v1/blocks/{{ $json.results[0].parent.page_id }}/children"
```

**원인**: 잘못된 데이터 경로 참조

**영향**: 2단계 결과를 노션에 저장하지 못함

**수정**:
```javascript
// 올바른 URL
"url": "https://api.notion.com/v1/blocks/{{ $json.page_id }}/children"
```

**파일**: `03-step2-notion-save-url-fix.json`

---

### 🟡 4. 5단계 ChatGPT API 인증 누락 (경고)
**영향받는 노드**: 5단계 - ChatGPT (최종 판단)1

**문제**: credentials 설정이 누락됨

**원인**: 노드 생성 시 인증 설정을 추가하지 않음

**영향**: OpenAI API 호출 시 401 Unauthorized 에러 발생

**수정**: httpHeaderAuth credentials 추가
```json
"credentials": {
  "httpHeaderAuth": {
    "id": "YOUR_OPENAI_CREDENTIAL_ID",
    "name": "OpenAI API Key"
  }
}
```

**설정 방법**:
1. n8n에서 Credential 생성
2. Type: Header Auth
3. Name: `Authorization`
4. Value: `Bearer YOUR_OPENAI_API_KEY`

**파일**: `04-step5-chatgpt-credentials-fix.json`

---

## 📁 파일 구조

```
workflows/fixes/
├── README.md                                # 이 파일
├── 01-telegram-error-nodes-fix.json        # 텔레그램 에러 노드 수정
├── 02-step3-request-preparation-fix.json   # 3단계 요청 준비 수정
├── 03-step2-notion-save-url-fix.json       # 2단계 노션 저장 URL 수정
└── 04-step5-chatgpt-credentials-fix.json   # 5단계 인증 추가
```

---

## 🔧 수정 적용 방법

### 방법 1: n8n UI에서 직접 수정

1. n8n 워크플로우 편집 화면 열기
2. 각 수정 파일의 `fixed_node` 내용 참조
3. 해당 노드의 설정을 수정
4. 저장 및 활성화

### 방법 2: JSON 파일로 전체 교체

1. 원본 워크플로우 백업
2. 수정된 노드들을 포함한 새 워크플로우 JSON 생성 (추후 제공)
3. n8n에서 Import
4. credentials 재설정

---

## ✅ 수정 후 확인 사항

- [ ] 모든 credentials가 올바르게 설정되었는지 확인
- [ ] 테스트 실행으로 각 단계가 정상 작동하는지 확인
- [ ] 에러 발생 시 텔레그램 알림이 오는지 확인
- [ ] 노션에 결과가 올바르게 저장되는지 확인
- [ ] 최종 점수와 상태가 업데이트되는지 확인

---

## 🚨 주의사항

1. **API 키 보안**: OpenAI, Notion, Perplexity API 키가 외부에 노출되지 않도록 주의
2. **Rate Limits**: API 호출 횟수 제한에 유의
3. **오류 처리**: 각 단계에 `continueOnFail: true` 설정으로 전체 워크플로우 중단 방지
4. **백업**: 수정 전 반드시 원본 워크플로우 백업

---

## 📞 문의

수정 사항에 대한 질문이나 추가 오류 발견 시 이슈를 등록해주세요.
