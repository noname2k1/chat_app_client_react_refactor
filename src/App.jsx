import 'antd/dist/antd.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './component//Global/GlobalStyle';
import Auth from './component/auth/Auth';
import store, { persistor } from '~/component/redux/store';
import { Provider } from 'react-redux';
import CreateMessage from './component/createMessageBox/CreateMessage';
import Content from './component/content/Content';
import NoRoom from './component/content/NoRoom/NoRoom';
import Profile from './component/auth/Profile/Profile';
import CallContextProvider from './component/Call/callContext';
import Error404 from './page/Error404';
import { MainLayout } from './layouts';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  return (
    <GlobalStyle>
      <Router>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Routes>
              <Route path="/auth" element={<Auth />}></Route>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Content />}></Route>
                <Route path="new" element={<CreateMessage />}></Route>
                <Route
                  path="rooms/room/:roomid"
                  element={
                    <CallContextProvider>
                      <Content />
                    </CallContextProvider>
                  }
                ></Route>
                <Route
                  path="rooms/profile/:profileid"
                  element={
                    <CallContextProvider>
                      <Content />
                    </CallContextProvider>
                  }
                ></Route>
                <Route path="rooms/no-room" element={<NoRoom />}></Route>
                <Route path="profile">
                  <Route path=":profileid" element={<Profile />}></Route>
                  <Route index element={<Profile />}></Route>
                </Route>
              </Route>
              <Route path="not-found" element={<Error404 />}></Route>
              <Route path="*" element={<Error404 />}></Route>
            </Routes>
          </PersistGate>
        </Provider>
      </Router>
    </GlobalStyle>
  );
};

export default App;
