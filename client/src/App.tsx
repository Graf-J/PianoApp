import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SongList from './components/SongList';
import SongInfo from './components/SongInfo';
import NotFound404 from './components/NotFound404';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={SongList}/>
        <Route path='/song/:id' exact component={SongInfo} />
        <Route path='*' component={NotFound404} />
      </Switch>
    </Router>
  );
}

export default App;
