const puppeteer = require("puppeteer");
const chalk = require("chalk");
var fs = require("fs");

// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword("green");

(async () => {
  try {
    // open the headless browser
    var browser = await puppeteer.launch({ headless: false });
    // open a new page
    var page = await browser.newPage();
    // enter url in page
    await page.goto(`https://advancescreenings.com/city/us/ma/boston`);
    await page.waitForSelector("h4.movie_title");

    var news = await page.evaluate(() => {
      var ageList = document.getElementsByClassName(`table-striped`);
      var titleNodeList = document.querySelectorAll(`div.col-sm-10 > h4.movie_title`);
      console.log(ageList)
      var titleLinkArray = [];
      for (var i = 0; i < titleNodeList.length; i++) {
        var save = (ageList[i].getElementsByTagName("tbody"))
        console.log(save)
        console.log(save[0].getElementsByTagName("tr"))
        console.log(save[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].innerText.trim())
        var innerLocation = save[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0]
        if(innerLocation.innerText.trim() !== 'Contest') {
          titleLinkArray.push({
            title: titleNodeList[i].innerText.trim(),
            link: `https://advancescreenings.com${innerLocation.getElementsByTagName("a")[0].getAttribute("href")}`,
            thing: innerLocation.innerText.trim()

          })
        }
      }
      return titleLinkArray;
    });
    // console.log(news);
    //await browser.close();
    // Writing the news inside a json file
    fs.writeFile("hackernews.json", JSON.stringify(news), function(err) {
      if (err) throw err;
      console.log("Saved!");
    });
    console.log(success("Browser Closed"));
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    await browser.close();
    console.log(error("Browser Closed"));
  }
})();
