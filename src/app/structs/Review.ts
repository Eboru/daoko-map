export class GetTasks{
  token : string = ""
}

export class GetTasksResposne{
  InternalCode : string = ""
  Payload : GetTasksResponsePayload = new GetTasksResponsePayload
}

export class GetTasksResponsePayload{
  queue : QueuedElement[] | undefined = undefined
}

export class QueuedElement{
  id : number = 0
  location : string = ""
  publisher : string = ""
  message : string = ""
  approved : boolean =false
}
