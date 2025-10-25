# 📥 팟캐스트 주제 검증 자동화 - 수정된 워크플로우 Import 가이드

## 🎯 개요

이 가이드는 수정된 워크플로우를 n8n에 import하고 설정하는 방법을 설명합니다.

**수정된 파일**: `podcast-validation-fixed.json`

---

## ✅ 적용된 수정 사항

1. **텔레그램 에러 노드 4개** - 노드 참조 수정 (`변수 설정` → `변수 설정1`)
2. **3단계 요청 준비** - Claude API 요청 생성 로직 구현
3. **2단계 노션 저장 URL** - page_id 참조 오류 수정
4. **5단계 ChatGPT API** - OpenAI credentials 추가

---

## 📋 사전 준비 사항

### 1. 필요한 API 키

다음 API 키들을 준비해주세요:

- ✅ **Notion API Token**
- ✅ **Perplexity API Key**
- ✅ **Claude API Key** (Anthropic)
- ✅ **OpenAI API Key**
- ✅ **Telegram Bot Token**

### 2. n8n Credentials 설정

n8n에서 다음 credentials를 미리 생성해주세요:

#### Notion API
- **Type**: Notion API
- **Name**: `Notion account`
- **API Key**: [Notion Integration Token]

#### Perplexity API
- **Type**: Header Auth
- **Name**: `Header Auth Perplexity`
- **Header Name**: `Authorization`
- **Header Value**: `Bearer YOUR_PERPLEXITY_API_KEY`

#### Claude API (Anthropic)
- **Type**: Header Auth
- **Name**: `Header Auth Claude`
- **Header Name**: `x-api-key`
- **Header Value**: `YOUR_CLAUDE_API_KEY`

#### OpenAI API (⚠️ 새로 추가 필요!)
- **Type**: Header Auth
- **Name**: `OpenAI API Key`
- **Header Name**: `Authorization`
- **Header Value**: `Bearer YOUR_OPENAI_API_KEY`

#### Telegram
- **Type**: Telegram API
- **Name**: `Telegram account`
- **Access Token**: [Your Telegram Bot Token]

### 3. 환경 변수 설정

n8n에서 다음 환경 변수를 설정해주세요:

```
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

---

## 🚀 Import 단계

### Step 1: 기존 워크플로우 백업 (선택사항)

기존 워크플로우가 있다면 먼저 백업하세요:

1. 기존 워크플로우 열기
2. 우측 상단 **...** (메뉴) → **Download** 클릭
3. JSON 파일을 안전한 곳에 저장

### Step 2: 새 워크플로우 Import

1. n8n 대시보드에서 **Workflows** 메뉴로 이동
2. 우측 상단 **Add Workflow** 클릭
3. **Import from File** 선택
4. `podcast-validation-fixed.json` 파일 선택
5. **Import** 클릭

### Step 3: Credentials 재설정

Import 후 일부 credentials가 연결되지 않을 수 있습니다. 다음 노드들의 credentials를 확인하고 재설정하세요:

#### ⚠️ 반드시 확인해야 할 노드:

1. **노션 페이지 상세 정보 가져오기1**
   - Credential: `Notion account`

2. **1단계 - Perplexity (주제 확장성)1**
   - Credential: `Header Auth Perplexity`

3. **2단계 - Perplexity (소재 발굴)1**
   - Credential: `Header Auth Perplexity`

4. **HTTP - 노션 1단계 저장1**
   - Credential: `Bearer Auth Notion`

5. **HTTP - 노션 2단계 저장1**
   - Credential: `Bearer Auth Notion`

6. **3단계 - Claude (대본 구조)1**
   - Credential: `Header Auth Claude`

7. **HTTP - 노션 3단계 저장1**
   - Credential: `Bearer Auth Notion`

8. **5단계 - ChatGPT (최종 판단)1** ⭐ (새로 추가!)
   - Credential: `OpenAI API Key`
   - ⚠️ 이 노드는 반드시 새로 생성한 OpenAI credential을 선택해야 합니다!

9. **HTTP - 노션 최종 저장 및 상태 변경1**
   - Credential: `Bearer Auth Notion`

10. **텔레그램 노드들** (5개)
    - Credential: `Telegram account`

### Step 4: Webhook URL 확인

1. **노션 웹훅 트리거** 노드 클릭
2. Production Webhook URL 복사
3. Notion 데이터베이스 자동화에 이 URL 설정

예시 URL:
```
https://your-n8n-instance.com/webhook/podcast-validation-trigger
```

### Step 5: 테스트 실행

1. 워크플로우 저장
2. 워크플로우 활성화 (우측 상단 토글)
3. Notion에서 테스트 페이지 생성하여 웹훅 트리거
4. n8n에서 실행 로그 확인

---

## 🔍 실행 후 확인 사항

### ✅ 정상 작동 확인

- [ ] 1단계: Perplexity에서 서브토픽 분석 완료
- [ ] 2단계: Perplexity에서 대화 소재 발굴 완료
- [ ] 3단계: Claude에서 대본 구조 생성 완료
- [ ] 5단계: ChatGPT에서 최종 평가 완료
- [ ] 노션 페이지 업데이트 (각 단계 결과 + 상태 변경)
- [ ] 텔레그램 완료 알림 수신

### ⚠️ 오류 발생 시 체크리스트

- [ ] 모든 credentials가 올바르게 설정되었는지 확인
- [ ] API 키가 유효한지 확인
- [ ] 각 API의 rate limit를 초과하지 않았는지 확인
- [ ] 환경 변수 `TELEGRAM_CHAT_ID`가 설정되었는지 확인
- [ ] Notion 데이터베이스에 필요한 속성들이 있는지 확인:
  - `Name` (title)
  - `상태` (status)
  - `점수` (number)

---

## 🆘 문제 해결

### 문제 1: "5단계 - ChatGPT (최종 판단)1" 노드에서 401 에러

**원인**: OpenAI API credentials가 설정되지 않았거나 잘못됨

**해결**:
1. n8n에서 새로운 Header Auth credential 생성
2. Name: `Authorization`
3. Value: `Bearer sk-YOUR_OPENAI_API_KEY`
4. 노드에서 이 credential 선택

### 문제 2: "3단계 요청 준비" 노드에서 에러

**원인**: 이전 단계 데이터가 없거나 형식이 잘못됨

**해결**:
1. 1단계와 2단계가 정상적으로 완료되었는지 확인
2. 각 단계의 출력 데이터 확인
3. 필요시 1~2단계를 다시 실행

### 문제 3: 텔레그램 에러 알림이 오지 않음

**원인**: `TELEGRAM_CHAT_ID` 환경 변수 미설정

**해결**:
1. n8n 설정에서 환경 변수 추가
2. Telegram에서 본인의 Chat ID 확인
3. `TELEGRAM_CHAT_ID=123456789` 형식으로 설정

### 문제 4: Notion에 결과가 저장되지 않음

**원인**: Notion API credentials 또는 URL 오류

**해결**:
1. Notion Integration이 해당 데이터베이스에 접근 권한이 있는지 확인
2. page_id가 올바르게 전달되는지 확인
3. 노션 블록 변환 코드 확인

---

## 📊 워크플로우 구조

```
노션 웹훅 트리거
  ↓
웹훅 데이터 파싱
  ↓
노션 페이지 상세 정보 가져오기
  ↓
변수 설정
  ↓
1단계: Perplexity (서브토픽 분석)
  ↓
2단계: Perplexity (대화 소재 발굴)
  ↓
3단계: Claude (대본 구조) ⭐ (수정됨)
  ↓
5단계: ChatGPT (최종 평가) ⭐ (credential 추가)
  ↓
노션 페이지 업데이트
  ↓
텔레그램 완료 알림
```

---

## 💡 팁

1. **비용 절감**: 테스트 시 5단계 중 일부만 활성화하여 API 비용 절감
2. **디버깅**: 각 단계의 출력을 확인하며 진행
3. **Rate Limit**: API 호출 간격 조정 필요 시 "Wait" 노드 추가
4. **에러 알림**: 텔레그램 에러 알림이 제대로 작동하는지 꼭 확인

---

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. n8n 실행 로그
2. 각 노드의 출력 데이터
3. API 응답 에러 메시지
4. Credentials 설정

---

**작성자**: Claude Code
**버전**: 1.0 (Fixed)
**최종 업데이트**: 2025-10-25
