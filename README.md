# MCP 서버 설정

이 저장소는 Claude Desktop에서 사용할 MCP (Model Context Protocol) 서버 설정을 관리합니다.

## 포함된 MCP 서버

### 1. n8n-mcp

n8n 워크플로우 자동화 도구와 통합하는 MCP 서버입니다.

**기능:**
- n8n 워크플로우 관리
- 자동화 작업 실행
- API를 통한 n8n 인스턴스 제어

**환경 변수:**
- `N8N_API_URL`: n8n 인스턴스 URL
- `N8N_API_KEY`: n8n API 인증 키
- `MCP_MODE`: stdio (표준 입출력 모드)
- `LOG_LEVEL`: error (에러 레벨 로깅)
- `DISABLE_CONSOLE_OUTPUT`: true (콘솔 출력 비활성화)

### 2. Playwright MCP

Playwright 브라우저 자동화 도구를 사용할 수 있는 MCP 서버입니다.

**기능:**
- 웹 브라우저 자동화
- 웹 스크래핑
- UI 테스팅
- 스크린샷 캡처

## 설치 및 사용 방법

### 1. Claude Desktop 설정

`mcp_config.json` 파일의 내용을 Claude Desktop의 설정 파일에 추가하세요.

**macOS:**
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```bash
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```bash
~/.config/Claude/claude_desktop_config.json
```

### 2. 설정 파일 병합

기존 설정 파일이 있다면, `mcp_config.json`의 `mcpServers` 내용을 기존 파일의 `mcpServers` 섹션에 병합하세요.

예시:
```json
{
  "mcpServers": {
    "n8n-mcp": {
      ...
    },
    "playwright": {
      ...
    }
  }
}
```

### 3. Claude Desktop 재시작

설정을 변경한 후 Claude Desktop을 재시작하세요.

## 환경 변수 설정

### n8n-mcp

n8n-mcp를 사용하려면 다음 환경 변수를 설정해야 합니다:

- `N8N_API_URL`: 본인의 n8n 인스턴스 URL로 변경
- `N8N_API_KEY`: 본인의 n8n API 키로 변경

현재 설정된 값은 예시이므로, 실제 환경에 맞게 수정하세요.

## 의존성

이 MCP 서버들은 `npx`를 통해 실행되므로, Node.js와 npm이 설치되어 있어야 합니다.

- Node.js 18 이상 권장
- npm 또는 yarn

## 문제 해결

### MCP 서버가 연결되지 않는 경우

1. Node.js와 npm이 올바르게 설치되어 있는지 확인
2. 터미널에서 수동으로 실행하여 오류 확인:
   ```bash
   npx n8n-mcp
   npx @playwright/mcp@latest
   ```
3. Claude Desktop 로그 확인

### n8n API 연결 오류

1. `N8N_API_URL`이 올바른지 확인
2. `N8N_API_KEY`가 유효한지 확인
3. 네트워크 연결 확인

## 참고 자료

- [MCP 공식 문서](https://modelcontextprotocol.io/)
- [n8n 공식 사이트](https://n8n.io/)
- [Playwright 공식 문서](https://playwright.dev/)
- [Claude Desktop MCP 가이드](https://docs.anthropic.com/claude/docs/model-context-protocol)

## 라이센스

MIT
