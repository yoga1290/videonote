# What's this?

This is a Firefox Add On that let's you mark video segments and add notes. Notes are only saved in-browser.
Allows Import/Export all the notes as CSV file. Works across Youtube, BiliBili &amp; VK-Video video platforms.
Coded in vanila Javascript & CSS, bundled through Webpack for each platform.

![docs/readme.png](docs/readme.png)

# Build

- Build on Docker containers:
    - Run `docker compose up` to install & build the bundles in the `dist` directory.

- Using NPM:
    - Install Node.js & NPM
    - Run `npm start` to trigger the build process
    - Vola, the build will be generated in the `dist` directory


# Usage:

![docs/readme.gif](docs/readme.gif)

1- Open Youtube video page or a supported platform.

2- Wait for Videonote panel to load below the video.

3- Play the video.

4- Click the "Bookmark" button to start marking the video bar.

5- Click the "OK" button to mark the end of the video segment.

6- Optionally, write or edit or delete a note from the panel cards.

    - Note, it gets prefilled using the transcripts/CC caption of Youtube (Desktop).

7- Optionally, you can Export / Import of all notes across all supported platforms into CSV file.

