/** OAuth 소셜 회원가입 페이지에서 사용하는 상수 정의 파일입니다. */

export const OAUTH_SIGNUP_TEXT = {
  errorTitle: '카카오 로그인 오류',
  loadingDescription: '카카오 로그인 정보를 확인하고 있습니다.',
  loadingTitle: '카카오 로그인 처리 중',
  loginButton: '로그인으로 돌아가기',
  unsupportedProvider: '지원하지 않는 소셜 로그인입니다.',
  missingCode: '인가 코드가 없어 카카오 로그인을 진행할 수 없습니다.',
  missingTeam: '팀 정보가 설정되지 않아 카카오 로그인을 진행할 수 없습니다.',
  invalidSession: '로그인 응답을 확인할 수 없습니다.',
  defaultError: '카카오 로그인에 실패했습니다. 다시 시도해주세요.',
} as const;
