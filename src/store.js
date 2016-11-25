import { AsyncStorage } from 'react-native';
import { createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { composeWithDevTools } from 'remote-redux-devtools';
import { createNavigationEnabledStore } from '@exponent/ex-navigation';

import reducer from './reducers';

const createStoreWithNavigation = createNavigationEnabledStore({
  createStore,
  navigationStateKey: 'navigation',
});

const composeEnhancers = composeWithDevTools({ realtime: true });
const store = createStoreWithNavigation(reducer, composeEnhancers(autoRehydrate()));

// TODO: Don't ignore feed
persistStore(store, { storage: AsyncStorage, whitelist: ['config'] });

export default store;