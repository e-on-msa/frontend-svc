// src/components/Challenge/ChallengeList.jsx

import ChallengeListItem from "./ChallengeListItem";

const ChallengeList = ({ challenges, onApply, userAge, userId }) => {
  if (!challenges || challenges.length === 0) {
    return (
      <div
        style={{
          color: "#999",
          padding: "32px",
          textAlign: "center",
          width: "90%",
          minWidth: "440px",
          margin: "0 auto"
        }}
      >
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div style={{ width: "90%", minWidth: "440px", margin: "0 auto" }}>
      {challenges.map((challenge) => (
        <ChallengeListItem
          key={challenge.challenge_id}
          {...challenge}
          onApply={() =>
            onApply({
              challenge_id: challenge.challenge_id,
              isJoined:
                !!challenge.my_participation &&
                challenge.my_participation.participating_state !== "취소",
              participationId: challenge.my_participation?.participating_id,
              participationState: challenge.my_participation?.participating_state
            })
          }
          userAge={userAge}
          userId={userId}
        />
      ))}
    </div>
  );
};

export default ChallengeList;
