import { Category } from "../enums/category.enum";
import { Status } from "../enums/status.enum";
import { Lesson } from "./lesson";

export interface CourseFormData {
  id?: number;
  name: string;
  category: Category;
  status: Status;
  lessons: Lesson[];
}