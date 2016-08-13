import "./index.scss";
import * as React from "react";
import BoundingRect from "sf-core/geom/bounding-rect";
import { startDrag } from "sf-front-end/utils/component";
import { ReactComponentFactoryDependency } from "sf-front-end/dependencies";
import { SelectAction, MouseAction, CANVAS_MOUSE_DOWN } from "sf-front-end/actions";

class DragSelectComponent extends React.Component<any, any> {

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.props.app.bus.register(this);
  }

  execute(action: MouseAction) {
    if (action.type === CANVAS_MOUSE_DOWN) {
      this.startDrag(action.originalEvent);
    }
  }

  componentWillUnmount() {
    this.props.app.bus.unregister(this);
  }

  startDrag(event) {

    const container = (this.refs as any).container;
    const b = container.getBoundingClientRect();

    const entities = this.props.allEntities;

    const left = (event.clientX - b.left) / this.props.zoom;
    const top  = (event.clientY - b.top) / this.props.zoom;

    this.setState({
      left: left,
      top : top,
      dragging: true
    });

    startDrag(event, (event2, { delta }) => {

      let x = left;
      let y = top;
      let w = Math.abs(delta.x / this.props.zoom);
      let h = Math.abs(delta.y / this.props.zoom);


      if (delta.x < 0) {
        x = left - w;
      }

      if (delta.y < 0) {
        y = top - h;
      }

      this.setState({
        left: x,
        top: y,
        width: w,
        height: h,
      });

      const bounds = new BoundingRect(x, y, x + w, y + h);

      const selection = [];

      entities.forEach(function (entity) {
        if (entity.display && entity.display.bounds.intersects(bounds)) {
          selection.push(entity);
        }
      });

      this.props.app.bus.execute(new SelectAction(selection));

    }, () => {
      this.setState({
        dragging: false,
        left: 0,
        top: 0,
        width: 0,
        height: 0
      });
    });
  }

  render() {

    const style = {
      left   : this.state.left,
      top    : this.state.top,
      width  : this.state.width,
      height : this.state.height,
      boxShadow: `0 0 0 ${1 / this.props.zoom}px #CCC`
    };

    const box = (<div style={style} className="m-drag-select--box">
    </div>);

    return (<div ref="container" className="m-drag-select">
      {this.state.dragging ? box : void 0}
    </div>);
  }
}

export const dependency = new ReactComponentFactoryDependency("components/tools/pointer/drag-select", DragSelectComponent);