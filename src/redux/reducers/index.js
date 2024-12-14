import { combineReducers } from 'redux';
import classesReducer from './classesReducer';
import relationshipsReducer from './relationshipsReducer';
import uiReducer from './uiReducer';

const rootReducer = combineReducers({
  classes: classesReducer,
  relationships: relationshipsReducer,
  ui: uiReducer,
});

export default rootReducer;
