export interface UpdateTaskDto {
  TaskName:string;
  Description:string;
  Priority: string;
  Status: string;
  Due_date: string | null; 
  Completed_date: string | null;
  lastmodifiedby: number;
  lastmodifiedtimestamp: string;
  actiontaken: string;
  updatedby: number;
  newstatus: string;
  assignedto?: number;
  updatedon: string;
  Comments: string;
}
