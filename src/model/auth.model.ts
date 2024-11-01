export class TokenPayload {
  user_uuid: string;
}

export class SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
}

export class SignupResponse {
  uuid: string;
  name: string;
  email: string;
}
