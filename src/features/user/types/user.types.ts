export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar?: string;
    studyGoal?: string;
    studyGoalCustom?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateUserData {
    name?: string;
    username?: string;
    email?: string;
    avatar?: string;
    studyGoal?: string;
    studyGoalCustom?: string;
}