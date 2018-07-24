import React from 'react';
import { render } from 'react-dom';
import App from '../app.jsx';
import '../css/basic';
const renderDom = Component => {
    render(
        <Component />,
        document.getElementById('app')
    );
}
renderDom(App);