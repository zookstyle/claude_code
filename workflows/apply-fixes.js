// 원본 워크플로우를 읽고 모든 수정 사항을 적용하는 스크립트
const fs = require('fs');

// 원본 파일 읽기
const originalPath = '/home/user/claude_code/workflows/podcast-validation-original.json';
const workflow = JSON.parse(fs.readFileSync(originalPath, 'utf8'));

// 수정 1: 텔레그램 에러 노드들의 노드 참조 수정
const telegramErrorNodes = [
  '텔레그램 - 1단계 에러',
  '텔레그램 - 2단계 에러',
  '텔레그램 - 3단계 에러',
  '텔레그램 - 5단계 에러'
];

workflow.nodes.forEach(node => {
  if (telegramErrorNodes.includes(node.name)) {
    // $('변수 설정') → $('변수 설정1')
    node.parameters.text = node.parameters.text.replace(/\$\('변수 설정'\)/g, "$('변수 설정1')");
    console.log(`✓ Fixed: ${node.name}`);
  }
});

// 수정 2: 3단계 요청 준비 노드 - Claude API 요청 생성 코드로 교체
const step3PrepNode = workflow.nodes.find(n => n.name === '3단계 요청 준비');
if (step3PrepNode) {
  step3PrepNode.parameters.jsCode = `// 이전 단계의 데이터 가져오기
const previousData = $('HTTP - 노션 2단계 저장1').item.json;

// 1단계와 2단계 결과 확인
const step1Result = previousData.step1_result || {};
const step2Result = previousData.step2_result || {};
const topic = previousData.topic || '제목 없음';
const pageId = previousData.page_id || '';

// 3단계 프롬프트 생성
const prompt = \`다음 팟캐스트 주제와 분석 결과를 바탕으로 대본 구조를 만들어주세요.

주제: \${topic}

1단계 결과 (서브토픽):
\${JSON.stringify(step1Result, null, 2)}

2단계 결과 (소재 발굴):
\${JSON.stringify(step2Result, null, 2)}

다음 형식으로 대본 구조를 만들어주세요:
- 각 세그먼트는 제목, 시간, 논의 포인트를 포함
- 세그먼트 간 자연스러운 전환 문구 추가
- 총 50분 이상의 대본 구조

출력 형식 (반드시 JSON으로만 응답):
{
  "segments": [
    {
      "title": "세그먼트 제목",
      "duration": 10,
      "discussion_points": ["포인트1", "포인트2"],
      "transition": "다음 세그먼트로의 전환 문구"
    }
  ],
  "total_duration": 55
}\`;

// Claude API 요청 본문 생성
const claudeRequestBody = {
  "model": "claude-3-5-sonnet-20241022",
  "max_tokens": 4096,
  "messages": [
    {
      "role": "user",
      "content": prompt
    }
  ]
};

// 이전 데이터와 함께 반환
return {
  ...previousData,
  claudeRequestBody: claudeRequestBody,
  prompt_step3: prompt
};`;
  console.log('✓ Fixed: 3단계 요청 준비');
}

// 수정 3: 2단계 노션 저장 URL 수정
const step2NotionNode = workflow.nodes.find(n => n.name === 'HTTP - 노션 2단계 저장1');
if (step2NotionNode) {
  // $json.results[0].parent.page_id → $json.page_id
  step2NotionNode.parameters.url = "=https://api.notion.com/v1/blocks/{{ $json.page_id }}/children";
  console.log('✓ Fixed: HTTP - 노션 2단계 저장1');
}

// 수정 4: 5단계 ChatGPT API credentials 추가
const step5ChatGPTNode = workflow.nodes.find(n => n.name === '5단계 - ChatGPT (최종 판단)1');
if (step5ChatGPTNode) {
  step5ChatGPTNode.credentials = {
    "httpHeaderAuth": {
      "id": "YOUR_OPENAI_CREDENTIAL_ID",
      "name": "OpenAI API Key"
    }
  };
  console.log('✓ Fixed: 5단계 - ChatGPT (최종 판단)1 - Added credentials');
}

// 수정된 워크플로우 저장
const fixedPath = '/home/user/claude_code/workflows/podcast-validation-fixed.json';
fs.writeFileSync(fixedPath, JSON.stringify(workflow, null, 2), 'utf8');

console.log('\n✅ All fixes applied successfully!');
console.log(`📁 Fixed workflow saved to: ${fixedPath}`);
