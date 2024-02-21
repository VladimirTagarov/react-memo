import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchLeaders = createAsyncThunk("leaders/fetchLeaders", async function () {
  const response = await fetch("https://wedev-api.sky.pro/api/leaderboard");

  const data = await response.json();
  return data;
});

const leaderSlice = createSlice({
  name: "leaders",
  initialState: {
    leaders: [],
    // id: '',
    // name: '',
    // time: '',
  },
  reducers: {},
  extraReducers: {
    [fetchLeaders.pending]: (state, action) => {},
    [fetchLeaders.fulfilled]: (state, action) => {
      state.leaders = action.payload;
    },
    [fetchLeaders.rejected]: (state, action) => {},
  },
});

export const { toggleCheck } = leaderSlice.actions;

export default leaderSlice.reducer;
