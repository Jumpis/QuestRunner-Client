import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import { RootState } from './store/modules';
import { actions } from './store/modules/userLogin';
import UserLogin from './UserLogin';
import UserJoin from './components/UserJoin/UserJoin';
// 라우팅
// Islogin
const App: React.FC = () => {
  const isLogin = useSelector((state: RootState) => state.commons.isLogin);
  // const dispatch = useDispatch();
  // dispatch(actions.setDarkmode({ darkmode: true }));
  return (
    <div className="App">
      <Switch>
        <Route exact path="/userJoinPage" component={UserJoin} />
        {/* <Route
            path="/user"
            render={() => {
              if (!isLogin) {
                return <Redirect to="/userLoginPage" />;
              }
              return <Theplace />;
            }}
          /> */}
        <Route path="/" render={() => <Redirect to="/user" />} />
      </Switch>
    </div>
  );
};

export default App;
