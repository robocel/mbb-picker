import React from 'react';
import ReactDOM from 'react-dom';

export default class SpecialFabButton extends React.Component {
    constructor(props) {
      super(props);
      this.el = document.createElement('div');
      this.fabRoot = document.getElementById(props.pid);
    }

    componentDidMount() {
      this.fabRoot.appendChild(this.el);
    }

    componentWillUnmount() {
      this.fabRoot.removeChild(this.el);
    }

    render() {
      return ReactDOM.createPortal(
        this.props.children,
        this.el,
      );
    }
  }
