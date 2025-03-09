export interface State {
  name: string;
  state_code: string;
}

export interface CountryStatesResponse {
  error: boolean;
  msg: string;
  data: {
    states: State[];
  };
}
