import { Category } from "./category.enum";
import { Lesson } from "./lesson";
import { Status } from "./status.enum";

export interface CourseFormData {
  name: string;
  category: Category;
  status: Status;
  lessons: Lesson[];
}