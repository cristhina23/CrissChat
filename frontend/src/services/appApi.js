import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const appApi = createApi({
  reducerPath: 'appApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  endpoints: (builder) => ({
    // Create user
    signupUser: builder.mutation({
      query: (user) => ({
        url: '/users/signup',
        method: 'POST',
        body: user,
      }),
    }),

    // Login user
    loginUser: builder.mutation({
      query: (user) => ({
        url: '/users/login',
        method: 'POST',
        body: user,
      }),
    }),

    // Logout user
    logoutUser: builder.mutation({
      query: (payload) => ({
        url: '/users/logout',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useSignupUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = appApi;

export default appApi;
