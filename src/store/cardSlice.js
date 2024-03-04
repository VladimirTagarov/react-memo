import { createSlice } from "@reduxjs/toolkit";

const cardSlice = createSlice({
  name: "cards",
  initialState: {
    cards: [],
    isChecked: false,
    isAlohomoraClicked: false,
    isEpiphanyClicked: false,
  },
  reducers: {
    toggleCheck(state, action) {
      if (state.isChecked) {
        state.isChecked = action.payload;
      } else {
        state.isChecked = !action.payload;
      }
    },
    toggleAlohomora(state, action) {
      state.isAlohomoraClicked = action.payload;
    },
    toggleEpiphany(state, action) {
      state.isEpiphanyClicked = action.payload;
    },
  },
});

export const { toggleCheck, toggleAlohomora, toggleEpiphany } = cardSlice.actions;

export default cardSlice.reducer;
