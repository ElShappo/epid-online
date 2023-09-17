import { createSlice } from '@reduxjs/toolkit'

export const authorizationSlice = createSlice({
    name: 'authorization',
    initialState: {
      authorized: false
    },
    reducers: {
      authorize: state => {
        state.authorized = true;
      },
      unauthorize: state => {
        state.authorized = false;
      },
    }
  });

  export const { authorize, unauthorize } = authorizationSlice.actions;
  export default authorizationSlice.reducer;