import axiosInstance from "./axiosInstance";

// 게시판 리스트 조회
export const getBoardList = () => {
  return axiosInstance.get("/api/boards");
};

// 게시판 상세 조회
export const getBoard = (boardId) => {
  return axiosInstance.get(`/api/boards/${boardId}`);
};

// 게시글 목록 조회
export const getBoardPosts = (boardId) => {
  return axiosInstance.get(`/api/boards/${boardId}/posts`);
};

// 게시글 상세 조회
export const getPost = (boardId, postId, commentPage = 1, commentLimit = 5) => {
  return axiosInstance.get(`/api/boards/${boardId}/posts/${postId}`, {
    params: { comment_page: commentPage, comment_limit: commentLimit }
  });
};

// 게시글 작성 (텍스트만 or 이미지 포함 FormData 모두 지원)
export const createPost = (boardId, postData) => {
  const isFormData = postData instanceof FormData;

  return axiosInstance.post(
    `/api/boards/${boardId}/posts`,
    postData,
    isFormData
      ? { headers: { "Content-Type": "multipart/form-data" } } // FormData일 때
      : undefined                                               // JSON일 때 기본 헤더
  );
};

// 게시글 수정 PUT /api/boards/posts/:post_id
export const updatePost = (postId, postData) => {
  const isFormData = postData instanceof FormData;
  return axiosInstance.put(
    `/api/boards/posts/${postId}`,
    postData,
    isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : undefined
  );
};

// 게시글 삭제 DELETE /api/boards/posts/:post_id
export const deletePost = (postId) => {
  return axiosInstance.delete(`/api/boards/posts/${postId}`);
};

// 댓글 작성 POST /api/boards/:board_id/posts/:post_id/comments
export const createComment = (boardId, postId, data) => {
  return axiosInstance.post(`/api/boards/${boardId}/posts/${postId}/comments`, data);
};

// 게시판 개설 승인/거절
export const updateBoardRequestStatus = (requestId, action) => {
  return axiosInstance.patch(`/api/boards/board-requests/${requestId}`, { action });
};


// 게시글 수정 (이미지 포함 FormData도 처리)
// export const updatePost = (postId, postData) => {
//   // FormData인지 판별
//   const isFormData = postData instanceof FormData;

//   return axiosInstance.put(
//     `/api/boards/posts/${postId}`,
//     postData,
//     isFormData
//       ? { headers: { "Content-Type": "multipart/form-data" } }
//       : undefined
//   );
// };


// // 게시글 삭제
// export const deletePost = (postId) => {
//   return axiosInstance.delete(`/api/boards/posts/${postId}`);
// };

// // 댓글 작성
// export const createComment = (postId, data) => {
//   return axiosInstance.post(`/api/boards/posts/${postId}/comments`, data);
// };

// 댓글 수정
export const updateComment = (commentId, data) => {
  return axiosInstance.put(`/api/boards/comments/${commentId}`, data);
};

// 댓글 삭제
export const deleteComment = (commentId) => {
  return axiosInstance.delete(`/api/boards/comments/${commentId}`);
};

// 게시판 개설 신청
export const createBoardRequest = (data) => {
  return axiosInstance.post(`/api/boards/board-requests`, data);
};

// 게시판 개설 신청 목록 조회
export const getAllBoardRequests = () => {
  return axiosInstance.get(`/api/boards/board-requests`);
};


// 게시글 댓글 신고
export const reportContent = (report_type, targetId, reason) => {
  const payload = {
    report_type,
    reason,
  };

  if (report_type === 'post') {
    payload.post_id = targetId;
  } else if (report_type === 'comment') {
    payload.comment_id = targetId;
  }

  return axiosInstance.post('/api/boards/reports', payload);
};

export const getAllReports = () => {
  return axiosInstance.get('/api/boards/admin/reports');
};