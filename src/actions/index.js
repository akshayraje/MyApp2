import * as types from './constants';

export const setLoading = (isLoading) => ({ type: types.SET_LOADING_STATE, payload: { isLoading: isLoading } });
