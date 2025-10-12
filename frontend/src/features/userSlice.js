import { createSlice } from "@reduxjs/toolkit";
import appApi from "../services/appApi";

export const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addNotifications: (state, { payload }) => {
      if (state?.notifications) {
        state.notifications.push(payload);
      } else {
        state.notifications = [payload];
      }
    },
    resetNotifications: (state, { payload }) => {
      if (state?.notifications) {
        state.notifications = state.notifications.filter(
          (n) => n.room !== payload
        );
      }
    },
  },
  extraReducers: (builder) => {
    // save user after signup
    builder.addMatcher(
      appApi.endpoints.signupUser.matchFulfilled,
      (state, { payload }) => payload.user
    );
    // save user after login
    builder.addMatcher(
      appApi.endpoints.loginUser.matchFulfilled,
      (state, { payload }) => payload.user
    );
    // logout user
    builder.addMatcher(
      appApi.endpoints.logoutUser.matchFulfilled,
      () => null
    );
  },
});

export const { addNotifications, resetNotifications } = userSlice.actions;
export default userSlice.reducer;
