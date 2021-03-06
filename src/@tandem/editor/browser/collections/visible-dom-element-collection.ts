import {
  DOMNodeType,
  SyntheticHTMLElement,
  VisibleSyntheticDOMElement,
  VisibleDOMNodeCapabilities,
} from "@tandem/synthetic-browser";
import { BoundingRect, IPoint, Mutation, ArrayCollection } from "@tandem/common";

export class VisibleSyntheticElementCollection<T extends VisibleSyntheticDOMElement<any>> extends ArrayCollection<T> {

  protected constructor(...elements: any[]) {
    super(

      // dirty check - might be better to use reflection here instead to check
      // for visible interface.
      ...elements.filter(element => element["getCapabilities"])
    );
  }

  get editable() {
    return this.find((entity) => Boolean(entity.source && entity.source.uri)) != null;
  }

  getAbsoluteBounds(): BoundingRect {
    return BoundingRect.merge(...this.map(element => element.getAbsoluteBounds()));
  }

  setPosition(position: IPoint) {
    const epos = this.getAbsoluteBounds();
    for (const element of this) {
      const elementBounds  = element.getAbsoluteBounds();
      element.setAbsolutePosition({
        left: position.left + (elementBounds.left - epos.left),
        top : position.top  + (elementBounds.top  - epos.top)
      });
    }
  }

  setAbsoluteBounds(nbounds: BoundingRect) {

    const cbounds = this.getAbsoluteBounds();

    for (const item of this) {
      const ibounds     = item.getAbsoluteBounds();

      const percLeft   = (ibounds.left - cbounds.left) / cbounds.width;
      const percTop    = (ibounds.top  - cbounds.top)  / cbounds.height;
      const percWidth  = ibounds.width / cbounds.width;
      const percHeight = ibounds.height / cbounds.height;

      const left   = nbounds.left + nbounds.width * percLeft;
      const top    = nbounds.top  + nbounds.height * percTop;
      const right  = left + nbounds.width * percWidth;
      const bottom = top + nbounds.height * percHeight;

      item.setAbsoluteBounds(new BoundingRect(left, top, right, bottom));
    }
  }

  getCapabilities(): VisibleDOMNodeCapabilities {
    const allCapabilities = [new VisibleDOMNodeCapabilities(true, true)];
    return VisibleDOMNodeCapabilities.merge(...this.map((element) => element.getCapabilities()));
  }

  createStyleEditChanges(): Mutation<any>[] {
    const mutations: Mutation<any>[] = [];
    for (const element of this) {
      const edit = element.createEdit();
      edit.setAttribute("style", element.getAttribute("style"));
      mutations.push(...edit.mutations);
    }
    return mutations;
  }
}
