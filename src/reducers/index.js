import { createActions, handleActions } from 'redux-actions';
import { SET_LOADING_STATE } from '../actions/constants';

export const { setLoading } = createActions(
    SET_LOADING_STATE
);

export const reducer = handleActions(
    {
        [setLoading]: (state, action) => ({
        ...state,
        isLoading: action.payload.isLoading
      }),
    },
    { isLoading: false }
);
