import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const leadersApi = createApi({
  reducerPath: "leadersApi",
  // tagTypes: ["Leaders"],
  baseQuery: fetchBaseQuery({ baseUrl: "https://wedev-api.sky.pro/api/v2/" }),
  endpoints: build => ({
    getLeaders: build.query({
      query: () => ({
        url: "leaderboard",
      }),
      //   providesTags: result =>
      //     result
      //       ? [...result.map(({ id }) => ({ type: "Leaders", id })), { type: "Leaders", id: "LIST" }]
      //       : [{ type: "Leaders", id: "LIST" }],
    }),
    addLeaders: build.mutation({
      query: body => ({
        url: "leaderboard",
        method: "POST",
        body: JSON.stringify(body),
      }),
      //   invalidatesTags: [{ type: "Leaders", id: "LIST" }],
    }),
  }),
});

export const { useGetLeadersQuery, useAddLeadersMutation } = leadersApi;
