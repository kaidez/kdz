# Style Guide for kaidez-written code

This is a style guide for my self-imposed rules for how I write code in projects. Follow these rules makes it easier for me to debug code, especially CSS.

I would probably need to change these rules when working in a team environment. But for projects where I'm only the client side person, following this style guide works for me.

## Understand the Basic structure
When the `kdz init` command is run, it scaffolds out my standard file and folder structure for a project. The structure looks like this:

       ├── project-folder
       ├── coffee
       |   └── main.coffee
       ├── css-build
       |   └── import
       ├── image-min
       ├── bower.json
       └── package.json
If either the `-l` flag or `-s` flag is passed to `kdz init`, then specific `.less` or `.scss` files will be created in `css-build/import`, respectively. Afterwards, commands are run that download Bootstrap's core CSS file via Bower and creates a core stylesheet that imports in all the preprocessor files.

For example, if `.less` files were built out, the structure would look like this:

       ├── project-folder
       ...
       └── css-build
           ├── style.less
           ├── bootstrap.css
           └── import
               ├── all-transform-3d-webkit-transform-3d.less
               ├── bootstrap-override.less
               ├── for.less
               ├── globals.less
               ├── max-device-width-480-orientation-landscape.less
               ├── max-width-767.less
               ├── min-width-1200.less
               ├── min-width-768-max-width-991.less
               ├── min-width-768.less
               ├── min-width-992-max-width-1199.less
               ├── min-width-992.less
               ├── mixins.less
               ├── mobile_first.less
               ├── retina-media-queries.less
               ├── screen-and-max-width-767.less
               ├── screen-and-min-width-768.less
               ├── screen-webkit-min-device-pixel-ratio-0.less
               ├── screen-webkit-min-device-pixel-ratio-0
               └── variables.less

...and `style.less` would look like this

    // style.less
    @import "imports/variables";
    @import "imports/mixins";
    @import "imports/for";
    @import "imports/bootstrap-override";
    @import "imports/retina-media-queries";
    @import "imports/globals";
    @import "imports/mobile_first";
    @import "imports/min-width-768";
    @import "imports/min-width-992";
    @import "imports/min-width-992-max-width-1199";
    @import "imports/min-width-1200";
    @import "imports/screen-and-max-width-767";
    @import "imports/screen-webkit-min-device-pixel-ratio-0";
    @import "imports/max-device-width-480-orientation-landscape";
    @import "imports/max-width-767";
    @import "imports/screen-and-min-width-768";
    @import "imports/all-transform-3d-webkit-transform-3d";
    @import "imports/min-width-768-max-width-991";

Key points

* All preprocessor variables would go in `variables.less`

* All preprocessor mixins would go in `mixins.less`

* `for.less` is a LESS-specific file that outputs a set of CSS selectors using a LESS function. The `.scss` file buildout doesn't have a similar file.

* `bootstrap-overide.less` would contain classes that are inside `bootstrap.css`.

* `retina-media-queries` would contain classes that define any classes based on retina and non-retina images.

* `mobile-first.less` would contain classes that appear on handheld views only.

* Media query files are listed in the order that the queries appear in the current version of bootstrap.css.

## CSS Build-out Process
In the example above, `style.less` compiles out to `style.css` in `css-build`. `style.css` gets concatenated with `bootstrap.css` to wherever I specify.

## CSS Naming Conventions
Clearly define selector names

__Right__

    .article-header {
      color: red;
      font-weight: bold;
    }

__Wrong__

    .red-bold-text {
      color: red;
      font-weight: bold;  
    }
<hr>

Create classes instead of IDs (when possible...some plugins make you style IDs)

__Right__

    .article-header

__Wrong__

    #article-header
<hr>
Dashes between selector names

__Right__

    .article-header

__Wrong__

    .articleHeader
<hr>
Selectors that appear on all views should be listed in `globals.less` and should start with `g-`

__Right__

    // In globals.less
    .gl-article-element {
      font-size: 18px;
    }

__Wrong__

    // In globals.less
    .article-element {
      font-size: 18px;
    }
<hr>
Selectors should not overlap in the various views

__Right__

    // Mobile First
    .article-header {
      font-size: 10px;
      color: red;
    }

    @media (max-width: 767px) {
      .article-header {
        color: blue;
      }
    }


__Wrong__

    // Mobile First
    .article-header {
      font-size: 10px;
      color: red;
    }

    // Overrides the Mobile First font size unnecessarily
    @media (max-width: 767px) {
      .article-header {
        font-size: 10px;
        color: blue;
      }
    }
Consider placing selectors like this `globals.less`
<hr>
Avoid overly-specific selectors

__Right__

    .menu-list-item {
      font-size: 12px;
      font-weight: bold;
    }

__Wrong__

    ul .menu-list-item {
      font-size: 12px;
      font-weight: bold;
    }

    __Wrong__

    ul > .menu-list-item {
      font-size: 12px;
      font-weight: bold;
    }

    __Wrong__

    #container ul > .menu-list-item {
      font-size: 12px;
      font-weight: bold;
    }

    __Really REALLY Wrong__

    div ul > .menu-list-item {
      font-size: 12px;
      font-weight: bold;
    }
<hr>


* JS variable names written in camel case and not dashes...keeping inline with Coffeescript rules


Comments should say what functions & CSS selectors do.


* make separate preprocesser files for things like JS/jQuery plugins. That file should start with "PLUGIN_". Al style related to the plugin go here, even one that are defined in separate media queries. Comment them thoroughly.

* use jQuery-style comments.

* ALWAYS try to avoid using `!important`, but there are times when you have no choice, such as overriding a plugin..

* when defining styles, list them in the following order:
    * tags
    * IDs (if required)
    * classes
