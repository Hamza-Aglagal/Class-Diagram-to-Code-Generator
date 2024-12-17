import { combineReducers } from 'redux';
import classesReducer from './classesReducer';
import relationshipsReducer from './relationshipsReducer';
import uiReducer from './uiReducer';
import socketReducer from './socketReducer';
import sessionReducer from './sessionReducer';

const rootReducer = combineReducers({
  classes: classesReducer,
  relationships: relationshipsReducer,
  ui: uiReducer,
  socket: socketReducer,
  session: sessionReducer,
});

export default rootReducer;
