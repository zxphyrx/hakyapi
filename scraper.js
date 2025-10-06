import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

async function scrape() {
    let { data } = await axios.get("https://haikyuu.fandom.com/wiki/Characters");
    let $ = cheerio.load(data);
    const characterLinks = [];
    const finalData = [];

    $(".wikia-gallery-item > .lightbox-caption > a").each((_, elem) => {
    characterLinks.push($(elem).attr("href"));
    })
  
    async function getData() {
        await Promise.all(characterLinks.map(async (link, index) => {
            let { data } = await axios.get(`https://haikyuu.fandom.com${link}`);
            let $ = cheerio.load(data);
            let name = $(`[data-source="title"]`).text();
            let characterData = {};

            characterData.id = index + 1;
            characterData.name = name;

            $("br").replaceWith("\n");
            $(`[class="pi-item pi-data pi-item-spacing pi-border-color"]`).each((_, elem) => {
                let key = $(elem).attr("data-source").replaceAll(" ", "-");
                let value = $(elem).find(`[class="pi-data-value pi-font"]`).text();
                characterData[key] = value;
            })

            finalData.push(characterData);
        }))
    }

    await getData();
    fs.writeFileSync("data.json", JSON.stringify(finalData, null, 2));
}

scrape();
