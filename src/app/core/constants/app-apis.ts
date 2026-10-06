import { environment } from "../../../environments/environment";

export const App_Apis = {
    auth: {
        register: `${environment.baseUrl}/users/signup`,
        login: `${environment.baseUrl}/users/signin`,
        changePassword: `${environment.baseUrl}/users/change-password`,
        uploadPhoto: `${environment.baseUrl}/users/upload-photo`,
        profileData: `${environment.baseUrl}/users/profile-data`,
    },
    users: {
        suggestions: `${environment.baseUrl}/users/suggestions`,
        bookmarks: `${environment.baseUrl}/users/bookmarks`,
        follow: (userId: string) => `${environment.baseUrl}/users/${userId}/follow`,
        profile: (userId: string) => `${environment.baseUrl}/users/${userId}/profile`,
        posts: (userId: string) => `${environment.baseUrl}/users/${userId}/posts`,
    },
    posts: {
        base: `${environment.baseUrl}/posts`,
        feed: `${environment.baseUrl}/posts/feed`,
        add: `${environment.baseUrl}/posts`,
        get: `${environment.baseUrl}/posts`,
        single: (postId: string) => `${environment.baseUrl}/posts/${postId}`,
        update: (postId: string) => `${environment.baseUrl}/posts/${postId}`,
        delete: (postId: string) => `${environment.baseUrl}/posts/${postId}`,
        like: (postId: string) => `${environment.baseUrl}/posts/${postId}/like`,
        likes: (postId: string) => `${environment.baseUrl}/posts/${postId}/likes`,
        bookmark: (postId: string) => `${environment.baseUrl}/posts/${postId}/bookmark`,
        share: (postId: string) => `${environment.baseUrl}/posts/${postId}/share`,
    },
    comments: {
        get: (postId: string) => `${environment.baseUrl}/posts/${postId}/comments`,
        add: (postId: string) => `${environment.baseUrl}/posts/${postId}/comments`,
        update: (postId: string, commentId: string) => `${environment.baseUrl}/posts/${postId}/comments/${commentId}`,
        delete: (postId: string, commentId: string) => `${environment.baseUrl}/posts/${postId}/comments/${commentId}`,
        like: (postId: string, commentId: string) => `${environment.baseUrl}/posts/${postId}/comments/${commentId}/like`,
        replies: (postId: string, commentId: string) => `${environment.baseUrl}/posts/${postId}/comments/${commentId}/replies`,
        addReply: (postId: string, commentId: string) => `${environment.baseUrl}/posts/${postId}/comments/${commentId}/replies`,
    },
    notifications: {
        getAll: `${environment.baseUrl}/notifications`,
        unreadCount: `${environment.baseUrl}/notifications/unread-count`,
        markAsRead: (notifId: string) => `${environment.baseUrl}/notifications/${notifId}/read`,
        markAllAsRead: `${environment.baseUrl}/notifications/read-all`,
    }
};