# Waifu Picker

Node.js server used to visualize and edit waifu data. Originally the idea was to use this server to fix any errors in the waifu dataset and pick the waifus which would be tokenized, but, after deciding to switch to an open collaboration system, we scrapped this server and set up a MediaWiki instance at [waifu.wiki](https://waifu.wiki), as it has way better tools to coordinate collaboration and it would allow the creation of a wiki that could go beyond this dataset, thus giving to the community. The wiki was bootstrapped with the scrapped dataset we had at the time, creating a wiki page for each waifu in the dataset.

We hope that the wiki will continue to be expanded by members of the community, therefore creating a highly curated waifu dataset that will be open and available to everyone.

## Node.js server
### Setup
```
npm install
```

### Run
```
node server.js
```

### Usage
The script will set up a webserver at http://localhost:8000 from which all the waifus will be accesible by id at http://localhost/:id: (eg: http://localhost/1 for waifu with id 1) from a web browser

## Wiki bootstrapping

To bootstrap the wiki by importing all the waifu data as pages, we took the following steps:
1. Export all the pages on the wiki using `Special:Export` and store them in `wiki/dump.xml`
2. Create a fake wiki dump by adding a new page for each waifu in the dataset (`wiki/waifus.json`) and store the new dump in `wiki/import.xml`. This was done by simply running `python craftxml.py`
3. Import the fake dump using a php script provided by MediaWiki, along with all the images
