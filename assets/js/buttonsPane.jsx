import React from 'react';

class ButtonsPane extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
      <button type="button" className="btn btn-outline-primary" onClick={this.props.clickCallBack}>Add Restaurant</button>
    </div>;
  }
}

export default ButtonsPane;