import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import classesReducer from './reducers/classesReducer';
import relationshipsReducer from './reducers/relationshipsReducer';
import uiReducer from './reducers/uiReducer';
import rootReducer from './reducers';


const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
