// 개인정보동의 약관

import React from "react";

export default function PrivacyPage() {
    return (
        <div style={{ maxWidth: "768px", margin: "40px auto", padding: "32px", lineHeight: 1.7, fontFamily: "Pretendard, sans-serif" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px" }}>개인정보 처리방침</h1>

            <p><strong>1. 수집하는 개인정보 항목</strong><br />
            서비스 이용을 위해 다음과 같은 개인정보를 수집할 수 있습니다:<br />
            - 이름, 이메일, 나이, 비밀번호<br />
            - 서비스 이용기록, 접속 로그, 쿠키, 접속 IP 정보 등</p>

            <p><strong>2. 개인정보 수집 및 이용 목적</strong><br />
            - 회원제 서비스 제공 및 본인 확인<br />
            - 서비스 개선 및 맞춤형 서비스 제공<br />
            - 불법/부정 이용 방지</p>

            <p><strong>3. 개인정보 보유 및 이용기간</strong><br />
            - 회원 탈퇴 시까지 보관합니다. 단, 관련 법령에 따라 일정 기간 보존이 필요한 경우 해당 기간 동안 보존됩니다.</p>

            <p><strong>4. 개인정보의 제3자 제공</strong><br />
            - 이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 다만, 법령에 근거하거나 수사기관의 요청이 있는 경우는 예외로 합니다.</p>

            <p><strong>5. 개인정보의 파기절차 및 방법</strong><br />
            - 수집 및 이용 목적이 달성된 후 해당 정보를 지체 없이 파기합니다.<br />
            - 전자적 파일 형태는 복구 불가능한 방법으로 삭제하며, 종이 문서는 분쇄 또는 소각합니다.</p>

            <p><strong>6. 이용자의 권리와 그 행사 방법</strong><br />
            - 언제든지 자신의 개인정보를 조회, 수정할 수 있으며, 수집 및 이용에 대한 동의를 철회할 수 있습니다.</p>

            <p><strong>7. 개인정보 보호책임자 안내</strong><br />
            - 이름: 이수연 <br />
            - 이메일: dltndus5985@gmail.com </p>

            <p style={{ marginTop: "40px", color: "#666", fontSize: "14px" }}>
                본 방침은 2025년 7월 15일부터 시행됩니다.
            </p>
        </div>
    );
}
