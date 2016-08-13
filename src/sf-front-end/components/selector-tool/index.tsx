import "./index.scss";
import * as React from "react";
import RulerComponent from "./ruler";
import ResizerComponent from "./resizer";
import { Editor, Workspace } from "sf-front-end/models";
import { FrontEndApplication } from "sf-front-end/application";
import { DisplayEntitySelection } from "sf-front-end/models";
import { IEntityDisplay, IEntity } from "sf-core/entities";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";

export default class SelectorComponent extends React.Component<{ editor: Editor, workspace: Workspace, app: FrontEndApplication, zoom: number, allEntities: Array<IEntity> }, any> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onResizing = () => {
    this.setState({ resizing: true });
  }

  onStopResizing = () => {
    this.setState({ resizing: false });
  }

  render() {

    const workspace = this.props.workspace;
    const selection = workspace.selection as DisplayEntitySelection;

    const display   = selection.display;

    // simple check to see if the selection array
    // is an IEntityDisplay
    if (!display) return null;

    const entireBounds = selection.display.bounds;

    const borderWidth = 1 / this.props.zoom;

    const boundsStyle = {
      position: "absolute",
      boxShadow: `0 0 0 ${borderWidth}px #a4b7d7`,
      left: entireBounds.left,
      top: entireBounds.top,

      width: entireBounds.width,
      height: entireBounds.height
    };

    return (<div className="m-selector-component">
      <ResizerComponent {...this.props} strokeWidth={2} selection={selection} onResizing={this.onResizing} onStopResizing={this.onStopResizing} />

      <div className="m-selector-component--bounds" style={boundsStyle} />

      {this.state.resizing ? <RulerComponent {...this.props} selection={selection} allEntities={this.props.allEntities} /> : undefined}
    </div>);
  }
}

export const dependency = new ReactComponentFactoryDependency("components/tools/pointer/selector", SelectorComponent);