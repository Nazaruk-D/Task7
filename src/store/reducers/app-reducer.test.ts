import {appReducer, setUserId, setUserName} from "./app-reducer";


describe("app reducer", () => {
    const initialState = {
        userName: "",
        userId: "",
        error: null,
    };

    it("should handle setting the user name", () => {
        const previousState = { ...initialState };
        const payload = "John Doe";
        const action = setUserName(payload);
        const state = appReducer(previousState, action);
        expect(state).toEqual({ ...initialState, userName: payload });
    });

    it("should handle setting the user ID", () => {
        const previousState = { ...initialState };
        const payload = "12";
        const action = setUserId(payload);
        const state = appReducer(previousState, action);
        expect(state).toEqual({ ...initialState, userId: payload });
    });
});