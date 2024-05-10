import { LitElement, css, html } from "lit";
// import "@uswds/uswds/scss/usa-link";

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart
 */
export class UsaLink extends LitElement {
  static get properties() {
    return {
      /**
       * The destination URL for the link
       */
      href: { type: String },
    };
  }

  constructor() {
    super();
    this.href = "";
  }

  render() {
    return html` <a class="usa-link" href="${this.href}"><slot></slot></a> `;
  }

  static styles = css`
    :host {
      a {
        color: var(--theme-link-color, #005ea2);
        text-decoration: underline;
      }
      a:visited {
        color: var(--theme-link-visited-color, #54278f);
      }

      a:hover {
        color: var(--theme-link-hover-color, #1a4480);
      }

      a:active {
        color: var(--theme-link-active-color, #162e51);
      }

      a:focus {
        /* @include focus-outline; */
        outline: var(--theme-focus-width, 0.25rem)
          var(--theme-focus-style, solid) var(--theme-focus-color, #2491ff);
        outline-offset: var(--theme-focus-offset, 0);
      }
    }
  `;
}

window.customElements.define("usa-link", UsaLink);
