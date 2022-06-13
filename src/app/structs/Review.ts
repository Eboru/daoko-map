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
  approved : boolean = false
  reviewd : boolean = false
}

export class Review{
  token : string = ""
  id : number = 0
  approved : boolean = false
}

export class ReviewResponse{
  InternalCode : string = ""
  Payload : string = ""
}
