/** 서비스 영역 전체 로딩 UI 컴포넌트입니다. */

export default function Loading() {
  return (
    <div id="page-loader">
      <div className="sp-3balls">
        <div className="ball ball01"></div>
        <div className="ball ball02"></div>
        <div className="ball ball03"></div>
      </div>
    </div>
  );
}
