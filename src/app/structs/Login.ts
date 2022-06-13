export class Login{
  username : string = ""
  password : string = ""
}

export class LoginResponse{
  InternalCode : string = ""
  Payload : LoginResponsePayload = new LoginResponsePayload
}

export class LoginResponsePayload{
  token : string = ""
}

export class VerifyToken{
  token : string | undefined = undefined
}

export class VerifyTokenResponse{
  InternalCode : string = ""
  Payload : string = ""
}
