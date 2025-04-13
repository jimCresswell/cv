# jimcresswell.net

## To do

### General

- [x] Fix the various spacing issues
- [x] Fix the appearance of the print and theme toggle buttons
- [x] Make the dropdown menu component not insane.
- [x] Move all of the inline scripts to proper code, might require theme provider, suspense boundary (one element gets the theme class, and every single other piece of content is known at build time), error boundary.
- [x] Possibly same as above, move all theme handling to [next-theme](https://github.com/pacocoursey/next-themes)
- [ ] Get a local copy of fonts for maximising performance.
- [x] Resolve how to handle client-side theme preferences without causing a hydration mismatch.
- [x] Use Winston for logging
- [x] Add a proper eslint config file
- [x] Add eslint rules for filenames, import order, no console, etc.
- [ ] On the homepage replace the old structured data with JSON-LD, and on the CV page, add JSON-LD, e.g. I am a person, I have a role, etc.
- [ ] Make sure the site is accessible, keyboard navigable, and screen reader friendly.
- [ ] Add a nav section to the header, with highlighting for current path.
- [ ] Change the "home" link to use the generated word mark icons, theme appropriate.

### CV

- [ ] Review the content
- [ ] Check the links
- [ ] Sort out the print formatting, it is not good.
- [ ] Make sure the HTML is properly semantic and accessible.

### Homepage

- [x] Get the content from the old home page.
- [x] Decide what the impact of the home page should be.
- [ ] Fix the light mode colours
- [ ] Overhaul the styles, including making the font size smaller.

### Fun

- [ ] Add a chatbot that persuades people why I am the right person for the job. Use the new [Chat SDK](https://chat-sdk.dev/). Double check:
  - [ ] Security
  - [ ] Rate limiting
  - [ ] Safety
