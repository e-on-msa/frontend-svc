function extractCityName(address) {
    if (!address || typeof address !== "string") return ""; // 주소가 없거나 문자열이 아니면 빈 문자열 반환

    const parts = address.split(" ");
    // console.log(parts);
    if (parts.length >= 2) {
        if (parts[0].includes("도")) {
            return parts[1]; // ex: 경기도 고양시 → 고양시
        } else {
            return parts[0]; // ex: 서울특별시 성북구 → 서울특별시
        }
    }
    return "";
}

export default extractCityName;
