import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullName: "",
  level: "",
  university: "",
  selectedCollege: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      return { ...state, ...action.payload };
    },
    setFullName: (state, action) => {
      state.fullName = action.payload;
    },
    setLevel: (state, action) => {
      state.level = action.payload;
    },
    setUniversity: (state, action) => {
      state.university = action.payload;
    },
    setSelectedCollege: (state, action) => {
      state.selectedCollege = action.payload;
    },
    resetUser: () => initialState,
  },
});

// Selectors
export const selectUser = (state) => state.user;
export const selectFullName = (state) => state.user.fullName;
export const selectLevel = (state) => state.user.level;
export const selectUniversity = (state) => state.user.university;
export const selectSelectedCollege = (state) => state.user.selectedCollege;
export const selectIsUserComplete = (state) => {
  const { fullName, level, university, selectedCollege } = state.user;
  return fullName && level && university && selectedCollege;
};

export const {
  setUserInfo,
  setFullName,
  setLevel,
  setUniversity,
  setSelectedCollege,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
