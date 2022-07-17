import { By } from "selenium-webdriver";

export const elements = {
    search: () => By.css("[data-project=onliner_main]"),
    logo: () => By.className("b-top-logo"),
    currencyLink: () => By.css("[class*=js-currency-widget] [class=b-top-navigation-informers__link]"),
    currencyConverter: (option: string) => By.id(`converter-${option}`),
    catalogTitle: () => By.className("catalog-navigation__title"),
    catalogItemsTitle: () => By.className("catalog-navigation-classifier__item-title"),
    searchResults: () => By.xpath("//*[@class='product__title']"),
    searchIframe: () => By.css("[class=modal-iframe]"),
    searchClose: () => By.css("[class=search__close]")
} as const;