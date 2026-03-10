export interface Note {
    id: string;
    topicId: string;
    contentId: string;
    text: string;
    createdAt: Date;
    updatedAt?: Date;
}