import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../api/axiosInstance";
import Header from "../../components/Common/Header";

export default function RecommendEntry() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const next = params.get("next") || "/recommend/select";

    useEffect(() => {
        (async () => {
            try {
                // 1) 로그인 확인
                await axios.get("/api/user/me");

                // 2) 관심사
                let interestsCount = 0;
                try {
                    // (A) /api/interests/myInterests
                    const { data } = await axios.get(
                        "/api/interests/myInterests"
                    );
                    // 예: { my: [...] } 또는 [...]
                    const arr = Array.isArray(data?.my)
                        ? data.my
                        : Array.isArray(data)
                        ? data
                        : [];
                    interestsCount = arr.length;
                } catch {
                    try {
                        // (B) /api/interests/my
                        const { data } = await axios.get("/api/interests/my");
                        const arr = Array.isArray(data?.my)
                            ? data.my
                            : Array.isArray(data)
                            ? data
                            : [];
                        interestsCount = arr.length;
                    } catch (err) {
                        console.error(err);
                    }
                }

                // 3) 진로희망
                let hasCareerGoal = false;
                try {
                    // (A) /api/visions/myVisions
                    const { data } = await axios.get("/api/visions/myVisions");
                    // 예: { my: [...] } 또는 [...]
                    const arr = Array.isArray(data?.my)
                        ? data.my
                        : Array.isArray(data)
                        ? data
                        : [];
                    hasCareerGoal = arr.length > 0;
                } catch {
                    try {
                        // (B) /api/visions/my
                        const { data } = await axios.get("/api/visions/my");
                        const arr = Array.isArray(data?.my)
                            ? data.my
                            : Array.isArray(data)
                            ? data
                            : [];
                        hasCareerGoal = arr.length > 0;
                    } catch (err) {
                        console.error(err);
                    }
                }

                const complete = interestsCount > 0 && hasCareerGoal;

                if (complete) {
                    navigate(next, { replace: true });
                } else {
                    navigate(
                        `/onboarding/preferences?redirect=${encodeURIComponent(
                            next
                        )}`,
                        { replace: true }
                    );
                }
            } catch {
                // 미로그인 → 로그인
                navigate(`/login?next=/recommend`, { replace: true });
            }
        })();
    }, [navigate, next]);

    return <Header />; // 항상 상단에 출력
}
