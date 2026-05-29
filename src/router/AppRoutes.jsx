import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";

// Auth
import Login from "../pages/Auth/LoginPage";
import Signup from "../pages/Auth/SignupPage";
import TermsPage from "../pages/Auth/TermsPage";
import PrivacyPage from "../pages/Auth/PrivacyPage";
import MarketingPage from "../pages/Auth/MarketingPage";

// Calendar & Suggestion
import Calendar from "../pages/Calendar/Calendar";
import Suggestion from "../pages/Suggestion/Suggestion";
import PreferenceInterest from "../pages/Suggestion/PreferenceInterest";
import PreferenceVision from "../pages/Suggestion/PreferenceVision";
import RecommendationResult from "../pages/Suggestion/RecommendationResult";
import RecommendEntry from "../pages/Suggestion/RecommendEntry";
import RecommendSelect from "../pages/Suggestion/RecommendSelect";
import HistoryRecommendation from "../pages/Suggestion/HistoryRecommendation";
import TimeRecommendation from "../pages/Suggestion/TimeRecommendation";

// Challenge
import Challenge from "../pages/Challenge/Challenge";
import ChallengeCreate from "../pages/Challenge/ChallengeCreate";
import ChallengeDetail from "../pages/Challenge/ChallengeDetail";
import Attendance from "../pages/Challenge/Attendance";
import ReviewList from "../pages/Challenge/ReviewList";
import ReviewCreate from "../pages/Challenge/ReviewCreate";
import ChallengeEdit from "../pages/Challenge/ChallengeEdit";
import ReviewEdit from "../pages/Challenge/ReviewEdit";

// Community
import CommunityList from "../pages/Community/CommunityList";
import CommunityWrite from "../pages/Community/CommunityWrite";
import CommunityEdit from "../pages/Community/CommunityEdit";
import BoardRequestPage from "../pages/Community/BoardRequestPage";
import PostDetail from "../pages/Community/PostDetail";

// MyPage
import MyPage from "../pages/MyPage/MyPage";
import MyInfoPage from "../pages/MyPage/MyInfoPage";
import ChangePasswordPage from "../pages/MyPage/ChangePasswordPage";
import DeactivateAccountPage from "../pages/MyPage/DeactivateAccountPage";
import MySchoolManagementPage from "../pages/MyPage/MySchoolManagementPage";
import MyBoardRequest from "../pages/MyPage/MyBoardRequest";
import ActivityHistory from "../pages/MyPage/ActivityHistory";
import MyParticipatedChallenges from "../pages/MyPage/MyParticipatedChallenges";
import MyCreatedChallenges from "../pages/MyPage/MyCreatedChallenges";
import PreferencesAndVisions from "../pages/MyPage/PreferencesAndVisions";
import ChooseInterest from "../pages/MyPage/ChooseInterest";
import ChooseVision from "../pages/MyPage/ChooseVision";

// Admin
import AdminPage from "../pages/Admin/AdminPage";
import UserManagement from "../pages/Admin/UserManagement";
import BoardRequestList from "../pages/Admin/BoardRequestList";
import ChallengeRequests from "../pages/Admin/ChallengeRequests";
import AdminChallengeDetail from "../pages/MyPage/AdminChallengeDetail";
import ReportList from "../pages/Community/ReportList";

const AppRoutes = () => {
    return (
        <Routes>
            {/* 기본 라우트 */}
            <Route path="/" element={<Calendar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/marketing" element={<MarketingPage />} />

            {/* Calendar */}
            <Route path="/calendar" element={<Calendar />} />

            {/* Challenge */}
            <Route path="/challenge" element={<Challenge />} />
            <Route path="/challenge/create" element={<ChallengeCreate />} />
            <Route path="/attendance/:challengeId" element={<Attendance />} />
            <Route path="/challenge/:id" element={<ChallengeDetail />} />
            <Route path="/challenge/:id/edit" element={<ChallengeEdit />} />
            <Route
                path="/challenge/:challengeId/reviews"
                element={<ReviewList />}
            />
            <Route
                path="/challenge/:challengeId/review/create"
                element={<ReviewCreate />}
            />
            <Route
                path="/challenge/:challengeId/review/:reviewId/edit"
                element={<ReviewEdit />}
            />

            {/* Recommend (새 흐름) */}
            {/* <Route path="/recommend" element={<RecommendEntry />} />
            <Route path="/recommend/select" element={<RecommendSelect />} />
            <Route path="/recommend/time" element={<TimeRecommendation />} />
            <Route path="/recommend/profile" element={<RecommendationResult />} />
            <Route path="/recommend/history" element={<HistoryRecommendation />} /> */}

            {/* Recommend (새 흐름) */}
            <Route path="/recommend" element={<RecommendEntry />} />

            {/* Recommend Select 내부 라우팅 */}
            <Route path="/recommend/select" element={<RecommendSelect />}>
                <Route path="profile" element={<RecommendationResult />} />
                <Route path="history" element={<HistoryRecommendation />} />
            </Route>

            {/* Onboarding (이전 suggestion 경로 정리) */}
            <Route
                path="/onboarding/preferences"
                element={<PreferenceInterest />}
            />
            <Route
                path="/onboarding/preferences/vision"
                element={<PreferenceVision />}
            />

            {/* 구 경로 호환 리다이렉트  */}
            <Route
                path="/suggestion"
                element={<Navigate to="/recommend/select" replace />}
            />
            <Route
                path="/recommendation/time"
                element={<Navigate to="/recommend/time" replace />}
            />
            <Route
                path="/suggestion/preferences"
                element={<Navigate to="/onboarding/preferences" replace />}
            />
            <Route
                path="/suggestion/preferences/vision"
                element={
                    <Navigate to="/onboarding/preferences/vision" replace />
                }
            />
            <Route
                path="/suggestion/recommendation"
                element={<Navigate to="/recommend/select/profile" replace />}
            />

            {/* Community */}
            <Route path="/community" element={<CommunityList />} />
            <Route
                path="/community/:board_id/write"
                element={<CommunityWrite />}
            />
            <Route
                path="/community/:board_id/edit"
                element={<CommunityEdit />}
            />
            <Route path="/community/posts/:post_id" element={<PostDetail />} />
            <Route
                path="/community/board-requests"
                element={<BoardRequestPage />}
            />

            {/* MyPage (중첩 라우트) */}
            <Route
                path="/mypage"
                element={
                    <PrivateRoutes>
                        <MyPage />
                    </PrivateRoutes>
                }>
                <Route index element={<Navigate to="info" replace />} />
                <Route path="info" element={<MyInfoPage />} />
                <Route path="my-school" element={<MySchoolManagementPage />} />
                <Route path="password" element={<ChangePasswordPage />} />
                <Route path="deactivate" element={<DeactivateAccountPage />} />
                <Route path="boardrequest" element={<MyBoardRequest />} />
                <Route path="activity-history" element={<ActivityHistory />} />
                <Route
                    path="my-challenges"
                    element={<MyParticipatedChallenges />}
                />
                <Route
                    path="created-challenges"
                    element={<MyCreatedChallenges />}
                />
                <Route
                    path="preferences-visions"
                    element={<PreferencesAndVisions />}
                />
                <Route path="choose-interests" element={<ChooseInterest />} />
                <Route path="choose-visions" element={<ChooseVision />} />
            </Route>

            {/* Admin (중첩 라우트) */}
            <Route
                path="/admin"
                element={
                    <PrivateRoutes>
                        <AdminPage />
                    </PrivateRoutes>
                }>
                <Route
                    index
                    element={<Navigate to="user-management" replace />}
                />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="board-requests" element={<BoardRequestList />} />
                <Route
                    path="challenge-requests"
                    element={<ChallengeRequests />}
                />
                <Route
                    path="challenge-requests/:id"
                    element={<AdminChallengeDetail />}
                />
                <Route path="reports" element={<ReportList />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
