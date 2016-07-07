import './index.scss';
import React from 'react';

import { ReactComponentFactoryFragment } from 'common/react/fragments';
// import { TemplateComponent, dom, freeze, createGetter } from 'paperclip';
import StageComponent from './stage';

class RootEditorComponent extends React.Component {
  render() {
    return <div className='m-editor'>
      <StageComponent {...this.props} entity={this.props.app.rootEntity} />
    </div>;
  }
}

export const fragment = ReactComponentFactoryFragment.create('rootComponentClass', RootEditorComponent);
