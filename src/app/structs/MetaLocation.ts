export class MetaLocations{
  InternalCode : string = ""
  Payload : MetaLocationsPayload = new MetaLocationsPayload
}

export class MetaLocationsPayload{
  locations : MetaLocation[] = []
}

export class MetaLocation{
  id : number = 0
  location : string = ""
}

export class LocationDetail{
  InternalCode : string = ""
  Payload : LocationDetailPayload = new LocationDetailPayload
}

export class LocationDetailPayload{
  publisher : string = ""
  message : string = ""
  date : string = ""
  reviewer : string = ""
}
