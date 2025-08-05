export interface TaskDTO {
  id: number;
  title: string;
  description: string | null;
  importance: number;
  enjoyment: number;
  practicalValue: number;
  createdAt: string;
  due: string | null;
}