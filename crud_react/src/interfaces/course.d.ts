export interface Course {
  id?: number;
  name: string;
  category: Category;
  status: Status;
  lessons: Lesson[];
}