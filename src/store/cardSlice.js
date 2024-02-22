import { createSlice } from "@reduxjs/toolkit";

const cardSlice = createSlice({
  name: "cards",
  initialState: {
    cards: [],
    isChecked: false,
  },
  reducers: {
    toggleCheck(state, action) {
      if (state.isChecked) {
        state.isChecked = action.payload;
      } else {
        state.isChecked = !action.payload;
      }
    },
  },
});

export const { toggleCheck } = cardSlice.actions;

export default cardSlice.reducer;
