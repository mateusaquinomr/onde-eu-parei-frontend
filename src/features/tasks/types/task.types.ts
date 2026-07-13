export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    completed: boolean;
    createdAt: string;
    completedAt?: string;
}

export interface CreateTaskDTO {
    title: string;
    description?: string;
    dueDate?: string;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    dueDate?: string | null;
    completed?: boolean;
}