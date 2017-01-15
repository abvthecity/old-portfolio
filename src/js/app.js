import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Landing from './views/Landing.js';
import Gallery from './views/Gallery.js';
import Project from './views/Project.js';

render(
  <Router history={hashHistory}>
    <Route path='/'>
      <IndexRoute component={Landing} />
      <Route path='/:galleryId'>
        <IndexRoute component={Gallery} />
        <Route path='/:projectId' component={Project} />
      </Route>
    </Route>
  </Router>,
  document.getElementById('portfolio')
);
