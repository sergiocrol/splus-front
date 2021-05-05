export interface Discussion {
  id: string;
  title: string;
  description: string;
  author: {
    id: number;
    fullName: string;
  };
  createdDate: string;
  displayDate: string;
}
