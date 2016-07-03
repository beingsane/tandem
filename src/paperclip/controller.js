import CoreObject from 'common/object';
import observable from 'common/object/mixins/observable';
import CallbackDispatcher from 'common/dispatchers/callback';
import { create as createTemplate, default as Template } from './template';

@observable
export default class ViewController extends CoreObject {

  /**
   * only initialize the controller once node has
   * been accessed.
   */

  get node() {
    return this.view.node;
  }

  get view() {
    if (this._view) return this._view;

    var template = this.constructor.template;

    // template source can be a string. Parse it if this is this case
    if (!(template instanceof Template)) {
      template = createTemplate(template);
    }

    this._view = template.createView(this);
    this.observe(CallbackDispatcher.create(this._didChange.bind(this)));
    return this.view;
  }

  update() {
    this.view.update();
  }

  static freeze(options) {
    return this.template.freeze(options);
  }

  _didChange() {
    this.view.update();
  }
}
