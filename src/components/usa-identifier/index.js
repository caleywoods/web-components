import { LitElement, html, css, unsafeCSS } from "lit";
import uswdsCoreStyle from "@uswds/uswds/scss/uswds-core?inline";
import styles from "./usa-identifier.css.js";
import usaIdentifierContent from "./identifier.json";

/**
 * @summary The usa-identifier component.
 *
 * @attribute {String} lang - Set the language for default text content (Options: "en" (Default), "es")
 * @attribute {Boolean} taxpayer - Include the taxpayer disclaimer text
 *
 * @slot domain - Site domain name
 * @slot logo - Optional slot to define the parent agency logo and url
 * @slot primary-agency - Information about the primary parent agency
 * @slot secondary-agency - Information about the secondary parent agency
 * @slot link-about - url and optional text content for the parent agency's about page
 * @slot link-accessibility - url and optional text content for the parent agency's accessibility statement
 * @slot link-foia - url and optional text content for the parent agency's Freedom of Information Act page
 * @slot link-fear - url and optional text content for the parent agency's No FEAR act page
 * @slot link-oig - url and optional text content for the parent agency's Office of the inspector general page
 * @slot link-performance -  url and optional text content for the parent agency's performance reports page
 * @slot link-privacy - url and optional text content for the parent agency's privacy statement page
 * @slot usagov - oOtional slot for defining custom USA.gov content
 *
 * @tagname usa-identifier
 */
export class UsaIdentifier extends LitElement {
  static properties = {
    lang: { type: String },
    taxpayer: {type: Boolean },
    label: { type: String }
  };

  static styles = [
    unsafeCSS(uswdsCoreStyle),
    styles
  ];

  connectedCallback() {
    super.connectedCallback();
    this.domain = this.querySelector('[slot="domain"]');
    this.logos = [...this.querySelectorAll('[slot="logo"]')];
    this.linkAbout = this.querySelector('[slot="link-about"]');
    this.linkAccessibility = this.querySelector('[slot="link-accessibility"]');
    this.linkFOIA = this.querySelector('[slot="link-foia"]');
    this.linkNoFEAR = this.querySelector('[slot="link-fear"]');
    this.linkOIG = this.querySelector('[slot="link-oig"]');
    this.linkPerformance = this.querySelector('[slot="link-performance"]');
    this.linkPrivacy = this.querySelector('[slot="link-privacy"]');
    this.disclaimer = this.querySelector('[slot="disclaimer"]');
    this.usagov = this.querySelector('[slot="usagov"]');
    this.agencyIntro = this.querySelector('[slot="agency-intro"]');
    this.agencyPrimary = this.querySelector('[slot="agency-primary"]');
    this.agencySecondary = this.querySelector('[slot="agency-secondary"]');
    this.agencyConjunction = this.querySelector('[slot="agency-conjunction"]');
    this.agencyTaxpayer = this.querySelector('[slot="agency-taxpayer"]');
    this.includeTaxpayer = this.getAttribute("taxpayer");
  }

  get _identifierText() {
    const content = usaIdentifierContent[this.lang] || usaIdentifierContent["en"];
    return content;
  }

  // Render the logo(s) for the masthead
  mastheadLogosTemplate() {
    if (this.logos.length > 0) {
      return html`
        <div class="usa-identifier__logos">
          ${this.logos.map((logo) => {
            const logoImage = logo.querySelector("img");
            logo.classList.add("usa-identifier__logo");
            logoImage.classList.add("usa-identifier__logo-img");
            return html`${logo}`;
          })}
        </div>
      `;
    }
  }

  mastheadTextTemplate() {
    const { masthead, taxpayer } = this._identifierText;
    const agencyIntro = this.agencyIntro ? this.agencyIntro.textContent: masthead.intro;
    const agencyConjunction = this.agencyConjunction ? this.agencyConjunction.textContent : masthead.conjunction;
    let taxpayerText;

    if (this.includeTaxpayer) {
      taxpayerText = this.agencyTaxpayer ? html`. ${this.agencyTaxpayer.textContent}` : html`. ${taxpayer}`;
    }
    /**
     * Scaffold domain text:
     * Add necessary classes for styling
     */
    if (this.domain) {
      this.domain.classList.add("usa-identifier__identity-domain");
    }
    /**
     * Scaffold disclaimer text:
     * Add necessary classes for styling
     */
    if (this.disclaimer) {
      this.disclaimer.classList.add("usa-identifier__identity-disclaimer");
    }

    return html`
      <section class="usa-identifier__identity">
        ${this.domain}
        <p class="usa-identifier__identity-disclaimer">
          ${this.agencySecondary?
            html`${agencyIntro} ${this.agencyPrimary} ${agencyConjunction} ${this.agencySecondary}${taxpayerText}`:
            html`${agencyIntro} ${this.agencyPrimary}${taxpayerText}`}
        </p>
      </section>
    `;
  }

  // Render the logos and text in the masthead
  mastheadTemplate() {
    if (this.domain || this.disclaimer || this.logos.length > 0) {
      return html`
        <section
          class="usa-identifier__section usa-identifier__section--masthead"
          aria-label="Agency description"
        >
          <div class="usa-identifier__container">
            ${this.mastheadLogosTemplate()} ${this.mastheadTextTemplate()}
          </div>
        </section>
      `;
    }
  }

  // Render the list of links
  linksTemplate() {
    const { required_links, aria_labels } = this._identifierText;
    const linksLabel = aria_labels.links;
    const linkAbout = this.linkAbout.textContent || required_links.about;
    const agencyShortname = this.linkAbout.getAttribute("shortname") || this.primaryAgency.textContent;
    const requiredLinks = [
      {
        title: `${linkAbout} ${agencyShortname}`,
        href: this.linkAbout.getAttribute("href")
      },
      {
        title: this.linkAccessibility.textContent || required_links.accessibility,
        href: this.linkAccessibility.getAttribute("href")
      },
      {
        title: this.linkFOIA.textContent || required_links.foia,
        href: this.linkFOIA.getAttribute("href")
      },
      {
        title: this.linkNoFEAR.textContent || required_links.no_fear,
        href: this.linkNoFEAR.getAttribute("href")
      },
      {
        title: this.linkOIG.textContent || required_links.oig,
        href: this.linkOIG.getAttribute("href")
      },
      {
        title: this.linkPerformance.textContent || required_links.performance,
        href: this.linkPerformance.getAttribute("href")
      },
      {
        title: this.linkPrivacy.textContent || required_links.privacy,
        href: this.linkPrivacy.getAttribute("href")
      }
    ];

    return html`
      <nav
        class="usa-identifier__section usa-identifier__section--required-links"
        aria-label="${linksLabel}"
      >
        <div class="usa-identifier__container">
          <ul class="usa-identifier__required-links-list">
            ${requiredLinks.map((requiredLink) =>
              html`
                <li class="usa-identifier__required-links-item">
                  <a class="usa-identifier__required-link usa-link" href="${requiredLink.href}">${requiredLink.title}</a>
                </li>
              `
            )}
          </ul>
        </div>
      </nav>
    `
  }

  // Render the footer USA.gov text
  usagovTemplate() {
    const { usagov } = this._identifierText;
    let usagovContent = html`${ usagov.description } <a class="usa-link" href="${ usagov.link_url }">${ usagov.link_label }</a>`;

    /**
     * If custom text is included in the usagov slot, scaffold that text:
     * Add necessary classes for styling
     */
    if (this.usagov) {
      const usagovLink = this.usagov.querySelector("a");
      usagovLink.classList.add("usa-link");
      usagovContent = this.usagov;
    }

    return html`
      <section
        class="usa-identifier__section usa-identifier__section--usagov"
      >
        <div class="usa-identifier__container">
          <div class="usa-identifier__usagov-description">
            ${usagovContent}
          </div>
        </div>
      </section>
    `;
  }

  render() {
    const { aria_labels } = this._identifierText;
    const componentAriaLabel = this.label || aria_labels.main;
    return html`
      <section class="usa-identifier" aria-label="${componentAriaLabel}">
        ${this.mastheadTemplate()}
        ${this.linksTemplate()}
        ${this.usagovTemplate()}
      </section>
    `;
  }
}

window.customElements.define("usa-identifier", UsaIdentifier);
