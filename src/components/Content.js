import React from 'react';

class Content extends React.Component {
  render() {
    let wording = this.props
    return(
      <div>
        {wording.wikitext}
      </div>
    )
  }
}
export default Content;
