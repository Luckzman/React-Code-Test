import { Action } from 'redux';
import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { RootState } from './types';
import { actionTypes } from './actionTypes';

type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  null,
  Action<string>
>;

const getAllUsersAction = (payload: { data: [] }) => ({
  type: actionTypes.GET_ALL_USERS,
  payload,
});

export const loadMoreUsers = (loading: boolean) => ({
  type: actionTypes.LOAD_MORE_USERS,
  loading,
});

export const pageDispatch = (): AppThunk => (dispatch) => {
  dispatch({ type: actionTypes.ADVANCE_PAGE });
};

const endOfList = () => ({
  type: actionTypes.END_OF_LIST,
});

export const getAllUsers = (page: number): AppThunk => {
  return (dispatch): {} => {
    const itemPerPage = 9;
    if (page <= 1) {
      dispatch(loadMoreUsers(false));
    } else {
      dispatch(loadMoreUsers(true));
    }
    return axios
      .get(`https://reqres.in/api/users?page=${page}&per_page=${itemPerPage}`)
      .then((response) => {
        if (itemPerPage * page >= response.data.total) {
          dispatch(getAllUsersAction(response.data));
          return dispatch(endOfList());
        }
        dispatch(getAllUsersAction(response.data));
        return dispatch(loadMoreUsers(false));
      })
      .catch((error) => {
        if (error.response) {
          dispatch(loadMoreUsers(false));
        }
      });
  };
};
