# Export Webflow

> CLI tool to export Webflow projects

`exportWebflow` is a script that uses Puppeteer to log in Webflow and navigate the website to download the exported project in a zip file.

## Getting started

```
Install dependencies:
$ npm install

Add .env file (then populate it):
$ cp .env.example .env

Run the script:
$ node index.js <project>
```

## Adding new projects

To add a new project, open the `.env` and `.env.example` files. Then add these two lines below (fill out the username and password for `.env`):

```
<PROJECT>_WEBFLOW_USERNAME=<username>
<PROJECT>_WEBFLOW_PASSWORD=<password>
```
