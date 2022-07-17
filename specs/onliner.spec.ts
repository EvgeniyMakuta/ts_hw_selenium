import { Builder, until, WebDriver } from "selenium-webdriver";
import {after, before} from "mocha";
import {expect} from "chai";
import {elements} from "../utils/selectors";
import {message, URL} from "../utils/url";

describe('Onliner', () => {
    let driver: WebDriver;

    before(async () => {
        driver = await new Builder().forBrowser("chrome").build();
        await driver.manage().setTimeouts({implicit: 10000});
        await driver.manage().setTimeouts({pageLoad: 10000});
        await driver.manage().window().maximize();
    });

    describe(`currency page open`, () => {
         it(`player opens currency page ${URL.currency}`, async () => {
             await driver.get(URL.base);
             await driver.sleep(3000)
             await driver.findElement(elements.currencyLink()).click();
             await driver.wait(until.elementLocated(elements.currencyConverter("in")), 3000);
        });
         it(`should be ${URL.currency} page opened`, async () => {
            await expect(await driver.findElement(elements.currencyConverter("out"))).exist;
            const currentUrl = await driver.getCurrentUrl();
            await expect(URL.currency).equal(currentUrl);
        });
    });

    describe("Logo returns to the base page", () => {
        it(`framework opens currency page ${URL.currency}`, async () => {
            await driver.get(URL.currency);
            await driver.wait(until.elementLocated(elements.currencyConverter("in")), 4000);
        });
        it(`player clicks on logo`, async () => {
            await driver.findElement(elements.logo()).click();
            await driver.wait(until.elementLocated(elements.logo()), 4000);

        });
        it(` should be base page ${URL.base} displayed` , async () => {
            const currentUrl = await driver.getCurrentUrl();
            await expect(URL.base).equal(currentUrl);
        });
    });

    describe("catalog navigation order", () => {
        it("framework opens catalog page", async () => {
            await driver.get(URL.catalog);
            await driver.wait(until.elementLocated(elements.catalogTitle()), 5000);
        });
        it("catalog navigation should have correct order", async () => {
            const currentNavOrder = await driver.findElements(elements.catalogItemsTitle());
            for (let i = 0; i < message.expectedNavOrder.length; i++) {
                await expect(message.expectedNavOrder[i]).equal(await currentNavOrder[i].getText())
            }
        });
    })

    describe("search results", () => {
        it("framework opens base page", async () => {
            await driver.get(URL.base);
            await driver.wait(until.elementLocated(elements.logo()), 4000);
        });
        it("player enters search result", async () => {
            await driver.findElement(elements.search()).sendKeys(message.search);
        });
        it(`search result should have '${message.search}'`, async () => {
            await driver.switchTo().frame(await driver.findElement(elements.searchIframe()));
            await expect(await driver.findElement(elements.searchResults()).getText()).contain(message.search);
            await driver.switchTo().parentFrame();
        });
    });

    describe("search close", () => {
        it("framework opens base page", async () => {
            await driver.get(URL.base);
            await driver.wait(until.elementLocated(elements.logo()), 4000);
        });
        it("player enters search result", async () => {
            await driver.findElement(elements.search()).sendKeys(message.search);
        });
        it("player closes search results popup", async () => {
            await driver.switchTo().frame(await driver.findElement(elements.searchIframe()));
            await driver.findElement(elements.searchClose()).click();
            await driver.switchTo().parentFrame();
        });
        it("search popup should be closed", async () => {
            // should be not.exist but there is no locator on the page
            await expect(await driver.findElement(elements.searchIframe())).exist;
        });
    });

    after(async () => {
        await driver.quit();
    })
})
