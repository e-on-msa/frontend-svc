// 마케팅 동의 페이지 

import React from "react";
import { Link } from "react-router-dom";

export default function MarketingPage() {
    return (
        <div style={{ maxWidth: "768px", margin: "40px auto", padding: "32px", fontFamily: "'Pretendard', sans-serif" }}>
            <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px" }}>마케팅 수신 동의</h1>

            <section style={{ lineHeight: 1.7, fontSize: "16px", color: "#333" }}>
                <p>귀하의 동의를 기반으로 다양한 혜택 및 정보를 제공해 드릴 수 있습니다.</p>
                <p>이 동의는 선택 사항이며, 동의하지 않으셔도 서비스 이용에는 제한이 없습니다.</p>

                <h3 style={{ marginTop: "20px", fontSize: "20px", fontWeight: "600" }}>1. 수집 및 이용 목적</h3>
                <p>이벤트, 혜택, 서비스 안내 등 마케팅 정보 제공</p>

                <h3 style={{ marginTop: "20px", fontSize: "20px", fontWeight: "600" }}>2. 수집 항목</h3>
                <p>이메일, 전화번호, 이름 등 회원가입 시 입력한 정보</p>

                <h3 style={{ marginTop: "20px", fontSize: "20px", fontWeight: "600" }}>3. 보유 및 이용기간</h3>
                <p>회원 탈퇴 또는 동의 철회 시까지 보관</p>

                <p style={{ marginTop: "24px" }}>
                    언제든지 <Link to="/mypage" style={{ color: "#4461f2", textDecoration: "underline" }}>마이페이지</Link>에서 수신 동의를 변경하실 수 있습니다.
                </p>

                <p style={{ marginTop: "40px", fontSize: "14px", color: "#888" }}>
                    시행일자: 2025년 7월 15일
                </p>
            </section>
        </div>
    );
}